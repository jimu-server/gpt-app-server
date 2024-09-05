package tree

import (
	"github.com/jimu-server/util/treeutils/tree/stack"
)

/*
	适用于 分类，分组，评论
*/

// Key 数据库 key 类型约束
type Key interface {
	int | string
}

type Node[T Key] struct {
	Id   T      `column:"id" json:"id"`
	Pid  T      `column:"pid" json:"pid"`
	Name string `column:"name" json:"name"`
}

func (receiver *Node[T]) GetId() T {
	return receiver.Id
}

func (receiver *Node[T]) GetPid() T {
	return receiver.Pid
}

func (receiver *Node[T]) GetName() string {
	return receiver.Name
}

// Entity 实现接口 通过获取一个父id和获取一个当前id
type Entity[T Key] interface {
	// GetId 获取 Empty 自生ID
	GetId() T
	// GetPid 获取 Empty 的父ID
	GetPid() T
	// GetName 获取 获取 Empty Name
	GetName() string
}

// TNode 树节点
type TNode[T Key] struct {
	Entity[T] `json:"entity"`
	Child     []*TNode[T] `json:"children"`
}

type AnyNode struct {
	Entity any        `json:"entity"`
	Child  []*AnyNode `json:"children"`
}

/*
BuildTree 获取 id 下的子树
@Param id 需要查询的节点主键id
@Param list 实现 Empty[T] 的切片数据
@Return tree 返回 指定 id 的节点及其子节点
*/
func BuildTree[T Key, L Entity[T]](id T, list []L) (tree []*TNode[T]) {
	return genTree[T, L](id, list)
}

/*
Tree 查找到当前id及其子节点树
@Param id 需要查询的节点主键id
@Param list 实现 Empty[T] 的切片数据
@Return tree 返回 指定 id 的节点及其子节点
*/
func Tree[T Key, L Entity[T]](id T, list []L) (tree []*TNode[T]) {
	var all T
	if list == nil || len(list) == 0 {
		return nil
	}
	nodes := genTree[T, L](all, list)
	find := findTree(id, nodes)
	return []*TNode[T]{find}
}

/*
GetChildIds 查询 pid 及其 pid的子id列表
@Param all 节点id列表
@Param pid 待查询的 父节点列表
@Return childIds 返回 pid 及其 pid的子节点id
*/
func GetChildIds[T Key, L Entity[T]](all []L, pid ...T) (childIds []T) {
	var z T
	childIds = append(childIds, pid...)
	pis := stack.New[T]()
	// 参数入栈
	for i := 0; i < len(pid); i++ {
		pis.Push(pid[i])
	}
	for p := pis.Popup(); p != z; p = pis.Popup() {
		for i := 0; i < len(all); i++ {
			entity := all[i]
			if entity.GetPid() == p {
				childIds = append(childIds, entity.GetId())
				pis.Push(entity.GetId())
			}
		}
	}
	return
}

/*
FullName 在树中找到全名
@Param id 带查找全名的主键
@Param nodes id 节点所在的节点列表
@Return Name 返回 指定id的全名列表，名称按顺序排序
*/
func FullName[T Key](id T, nodes []*TNode[T]) (Name []string) {
	for i := 0; i < len(nodes); i++ {
		node := nodes[i]
		if node == nil {
			continue
		}
		//如果找到了目标 则开始从节点回溯找到全路径
		if node.GetId() == id {
			Name = append(Name, node.GetName())
			return
		}
		if node.Child != nil {
			name := FullName(id, node.Child)
			if len(name) != 0 {
				Name = append(Name, node.GetName())
				Name = append(Name, name...)
				return
			}
		}
	}
	return
}

// buildNode
// 指定节点列表 nodes
// 指定一个父节点 pid
// 一般用于初始化一批已存在的 Node
func buildNode[T Key](pid T, tree ...*TNode[T]) []*TNode[T] {
	list := make([]*TNode[T], 0)
	for i := 0; i < len(tree); i++ {
		if tree[i].Entity.GetPid() == pid {
			child := buildNode[T](tree[i].Entity.GetId(), tree...)
			tree[i].Child = child
			list = append(list, tree[i])
		}
	}
	return list
}

func genTree[T Key, L Entity[T]](pid T, list []L) []*TNode[T] {
	arr := make([]*TNode[T], 0)
	for i, _ := range list {
		arr = append(arr, &TNode[T]{Entity: list[i]})
	}
	nodes := make([]*TNode[T], 0)
	for i := 0; i < len(arr); i++ {
		if arr[i].Entity.GetPid() == pid {
			child := buildNode(arr[i].Entity.GetId(), arr...)
			arr[i].Child = child
			nodes = append(nodes, arr[i])
		}
	}
	return nodes
}

func findTree[T Key](id T, list []*TNode[T]) *TNode[T] {
	for i := 0; i < len(list); i++ {
		node := list[i]
		if node.GetId() == id {
			return node
		}
		if node.Child != nil && len(node.Child) > 0 {
			return findTree(id, node.Child)
		}
	}
	return nil
}
