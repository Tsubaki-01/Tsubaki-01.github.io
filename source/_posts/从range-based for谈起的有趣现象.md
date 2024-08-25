---
title: 从range-based for谈起的有趣现象
date: 2024-08-23
tags:
  - CPP-STL
  - CPP
  - CPP-lifetime
categories:
  - CPP
author: 笑清
copyright: true 
---

## 写在前面

本文主要说明了关于多维的STL容器地址空间如何分配，以及临时对象的生命周期等问题

<!--more-->

近日，在做题的时候，想要重置一个`vector`容器中元素的值，错误地使用了以下代码：

```c++
vector<vector<int>> vec(n, vector<int>(n,0));
memset(vec[0].data(), 0, vec.size()*vec[0].size()*sizeof(int));
```

运行之后发现报了越界错误，查阅`memset`函数的说明之后发现，传入`memset`的指针指向内容所占用的内存空间需要是连续的。那么对于多维的`vector`容器，其地址空间是否是连续的呢？

### 多维 vector 的地址

```c++
#include <iostream>
#include <vector>

int main() {
    std::vector<std::vector<int>> vec = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };

    for (size_t i = 0; i < vec.size(); ++i) {
        std::cout << "Address of row " << i << ": " << &vec[i] << std::endl;
    }

    return 0;
}

运行结果：
Address of row 0: 0x27a49f2a800
Address of row 1: 0x27a49f2a818
Address of row 2: 0x27a49f2a830
```

可以发现，二维（多维）的vector中，每行的vector在地址中可能并不是连续的

之前背八股文的时候，对于`vector`空间的理解都是基于一维的`vector`，突然遇到多维的`vector`，就好像在某个运行良好的知识模块中遇到了bug，以下是对于其的总结。

二维 `vector` 的每一行实际上是一个独立的一维 `vector`，而这些一维 `vector` 的内存位置是独立分配的。因此，虽然每个一维 `vector` 内部的元素是连续的，但在二维 `vector` 中，不同的行在内存中的地址不一定是连续的。

具体来说：

- 在 `std::vector<std::vector<int>>` 中，外层 `vector` 存储的是指向内层 `vector` 的指针（或者说引用）。
- 每个内层 `vector`（即每一行）在内存中都是独立分配的，因此不同行之间的地址不一定是连续的。

---

### rang-based for

了解了`vector`的这一特性，自然是不能用`memset`了，老老实实循环遍历吧

```c++
for(auto row:vec)
    std::fill(row.begin(), row.end(), 0);
```

修改完程序，运行时又发现并没有成功修改容器元素的值，还是保持原样。

这时自然怀疑是不是值传递的问题，修改

```c++
for(auto& row:vec)
    std::fill(row.begin(), row.end(), 0);
```

正常运行。

> 之前总注意到有说,range-based for里面需要用引用,一直没有放在心上,也一直没有遇到问题,直到这次才切身理解了这么做的原因

`range-based for`如果不加`&`的话，都是采用**值传递**的方式，只有加了`&`，采用传引用的方式，才能实现对元素的修改。

> 同时，传引用也能避免复制带来的资源与时间的浪费。

### range-based for的一个缺陷

在查阅`range-based for`相关资料的时候，发现了一个有趣的东西。下面是原文地址。

https://zhuanlan.zhihu.com/p/701995823

---

---

临时对象的生命周期值得重点关注，咱们先从 C++ for 循环的一个缺陷谈起，争取能用这一篇文章将临时对象的生命周期讲明白。

先看一段代码：

```cpp
struct Rank {
  vector<string> top3_;
  auto& top3() { return top3_; }
};
auto getRank() {
  return Rank{{"a", "b", "c"}};
}
```

这段代码模拟了一个排行榜类 Rank，函数 getRank 根据实时数据创建并返回排行榜对象。

写到 for 循环里，对排行榜前三名进行遍历：

```cpp
for (auto& str: getRank().top3()) {
  cout << str << '\n';
}
```

这段代码简练流畅，看起来没什么问题，然而恰恰埋藏着一只大 bug，幸运的是产生了崩溃，让我直接定位到了这里。

根据语言标准，这段 for 循环等价于：

```cpp
auto&& r = getRank().top3();
for (
  auto i = r.begin(), e = r.end(); 
  i != e; ++i
) 
{
  auto& str = *i;
  cout << str << '\n';
}
```

注意，getRank() 返回的是临时对象，getRank().top3() 返回了临时对象成员的引用，而 auto&& r = getRank().top3(); 执行完毕后，临时对象的生命周期结束，与之相关的引用也随之失效，之后对迭代器的操作就全是错误的了。

如果要遍历临时对象的话，需要遍历的**临时对象**必须是**右值表达式**，而且也要注意表达式中间产生的其他临时对象是在循环开始前就会被销毁的，只有表达式返回的最后的临时对象才会被“存”起来。

这种问题是怪程序员不够小心，还是语言本身就存在缺陷呢？笔者认为不应一概而论，但现有的基于范围的 for 语句对临时对象不够友好是肯定的，C++23 标准已提出应延长相关临时对象的生命周期至 for 循环结束。

在 C++23 之前可以这么改：

```cpp
auto&& r = getRank();
for (auto& str: r.top3()) {
  cout << str << '\n';
}
```

或者将 top3 函数的返回类型改为按值返回，便延长了临时对象的生命周期。

从这个问题可以看出，**临时对象的生命周期什么时候可以延长，什么时候不能延长是需要特别注意的**，现总结如下：

如果“直接”引用临时对象，可以延长其生命周期：

```cpp
struct T {
  string member;
  string val() { return member; }
  string& ref() { return member; }
};
auto&& a = T();         // T() 延长
auto&& b = T().member;  // T() 延长
auto&& c = T().val();   // val() 返回值延长，T() 析构
auto&& d = T().ref();   // 引用无效
```

例中 a 和 b 都延长了临时对象的生命周期，c 延长了 val() 返回值的生命周期，即**将纯右值与引用绑定时可以使其生命周期与引用的生命周期保持一致**。ref() 返回的不是纯右值，T() 在语句执行完毕后析构，d 成了无效引用。

但在 C++17 之前，构造函数[初始化列表](https://zhida.zhihu.com/search?q=初始化列表)中的绑定不会延长临时对象的生命周期：

```cpp
struct T {
  const string& s;
  T(const string& s): s(s) {}
};
T obj("abc"); // 引用无效
```

例中 "abc" 会被转换成 string 型临时对象， 但临时对象的生命周期在构造函数返回后结束，成员引用 s 成了无效引用。

如果不通过构造函数，而是通过 [Aggregate initialization](https://link.zhihu.com/?target=https%3A//en.cppreference.com/w/cpp/language/aggregate_initialization) 初始化，如：

```cpp
struct T {
  const string& s;
};
T a{"a"};
T* b = new T{"b"};
const T& c = T{"c"};
T&& d = T{"d"};
```

理论上也可以将临时对象直接与引用绑定，但目前来看各编译器实现不一致，相关引用可能是有效的，也可能是无效的，所以还是应该**避免将临时对象与成员引用绑定**。

临时对象作为函数的参数、调用[成员函数](https://zhida.zhihu.com/search?q=成员函数)或重载的运算符时，生命周期无法延长，这正是本文开头时的情况，这里再举个栗子：

```cpp
auto&& r = vector<int>{1, 2, 3}[0];   // 引用无效
```

最后一种情况是函数返回临时对象的引用，如：

```cpp
const string& fun() {
  return string("abc");
}
int main() {
  auto& r = fun();  // 引用无效
  cout << r << '\n';
}
```

临时对象在函数返回后立即失效，相关引用都是无效的，这种情况各大编程规范已经强调多次，但值得再次强调。

