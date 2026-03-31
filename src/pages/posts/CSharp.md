---
layout: ../../layouts/MarkdownPostLayout.astro
title: c#语法个人速记
pubDate: 2026-03-27T15:24:00
author: AsahinaMafuyu
description: 由于游戏和学习需要用到c#语法，因此暂时快速过一遍c#语法咯
cover:
  url:
  alt:
tags:
  - CSharp
  - 学习笔记
---
## 基础语法

### 数组

#### 遍历

```c#
// 使用 foreach 循环遍历数组
foreach (int number in numbers)
{
	Console.WriteLine(number);
}
```

#### 查找

可以使用 `Array.IndexOf` 方法来查找数组中某个元素的索引。

```c#
int [] numbers = { 1, 2, 3 }
int index = Array.IndexOf(numbers, 2);
Console.WriteLine(index); // 输出 1
```

#### 排序

数组的排序可以使用 `Array.Sort` 方法。

```c#
Array.Sort(numbers);
foreach (int number in numbers)
{
	Console.WriteLine(number); // 输出排序后的数组`
}
```

### 异常处理

#### 示例

```c#
try {
	int[] numbers = { 1, 2, 3 };
	Console.WriteLine(numbers[5]);
} catch (IndexOutOfRangeException ex) {
	Console.WriteLine("数组下标超出范围：" + ex.Message);
} finally {
	Console.WriteLine("无论是否发生异常，这段代码都会执行。");
}
```

#### 自定义异常

```c#
public class InvalidAgeException : Exception {
	public InvalidAgeException(string message) : base(message) { }
}
```

```c#
public void CheckAge(int age) {
	if (age < 18) {
		throw new InvalidAgeException("年龄不能小于18岁");
	}
	Console.WriteLine("年龄符合要求");
}
```

### 继承

类的继承用 ：表示，例如：

```c#
public class Animal
{
    public string Name { get; set; }

    public void Eat()
    {
        Console.WriteLine($"{Name} is eating.");
    }

    public void Sleep()
    {
        Console.WriteLine($"{Name} is sleeping.");
    }
}

public class Cat : Animal
{
    public void Meow()
    {
        Console.WriteLine("Cat says: Meow!");
    }
}
```

`public string Name { get; set; }`

本质上其实就是：

```c#
private string _name;

public string Name
{
    get { return _name; }
    set { _name = value; }
}
```

可以这么用：

```c#
Animal a = new Animal();
a.Name = "Tom";          // set
Console.WriteLine(a.Name); // get
```

#### base关键字

```c#
class Animal
{
    public void Eat()
    {
        Console.WriteLine("动物在吃东西");
    }
}

class Cat : Animal
{
    public void Show()
    {
        base.Eat();
    }
}
```

类似于java中的`super`等等

还有就是调用父类的构造函数：

```c#
class Animal
{
    public string Name;

    public Animal(string name)
    {
        Name = name;
    }
}

class Cat : Animal
{
    public Cat(string name) : base(name)
    {
    }
}
```

这里：

```c#
: base(name)
```

意思是：

**在创建 `Cat` 对象时，先去调用父类 `Animal` 的构造函数，并把 `name` 传过去。**

#### 方法重写

C# 不是默认都能重写。  
父类必须先写 `virtual`，子类才能 `override`。

```c#
class Animal
{
    public virtual void Speak()
    {
        Console.WriteLine("动物发出声音");
    }
}

class Cat : Animal
{
    public override void Speak()
    {
        base.Speak();
        Console.WriteLine("猫叫：喵喵");
    }
}
```

```c#
using System;
public class Animal
{
	public virtual void MakeSound()
	{
		Console.WriteLine("Animal makes a sound");
	}
}

public class Dog : Animal
{

	public override void MakeSound()
	{
		Console.WriteLine("Dog barks");
	}
}

public class Cat : Animal
{
	public override void MakeSound()
	{
		Console.WriteLine("Cat meows");
	}
}

public class Program
{
	public static void Main()
	{
		Animal myDog = new Dog();
		Animal myCat = new Cat();
		myDog.MakeSound(); // 输出：Dog barks
		myCat.MakeSound(); // 输出：Cat meows
	}
}
```

#### 接口

```c#
using System;
public interface IShape
{
	void Draw();
}

public class Circle : IShape
{
	public void Draw()
	{
		Console.WriteLine("Drawing a circle");
	}
}

public class Rectangle : IShape
{
	public void Draw()
	{
		Console.WriteLine("Drawing a rectangle");
	}
}

public class Program
{
	public static void Main()
	{
		IShape myCircle = new Circle();
		IShape myRectangle = new Rectangle();
		myCircle.Draw(); // 输出：Drawing a circle
		myRectangle.Draw(); // 输出：Drawing a rectangle
	}
}
```

> 这里不像java，需要用@override，对于接口的方法，直接编写即可

### 封装

#### 访问修饰符

访问修饰符用于控制类成员的可见性。C# 提供了以下几种访问修饰符：

1. **public**：公共访问，成员可以被任何代码访问。
2. **private**：私有访问，成员只能在其所属类内部访问。
3. **protected**：受保护访问，成员可以在其所属类和派生类中访问。
4. **internal**：内部访问，成员只能在同一程序集内访问。
5. **protected internal**：受保护内部访问，成员可以在同一程序集内访问，或者在派生类中访问。

相关示例如下：

```c#
public class Rectangle
{
	private double length; // 私有字段
	private double width; // 私有字段
	
	public double Length // 公共属性
	{
		get { return length; }
		set { length = value; }
	}
	
	public double Width // 公共属性
	{
		get { return width; }
		set { width = value; }
	}
	
	public double Area // 只读属性
	{
		get { return length * width; }
	}
}
```

### 集合

#### List

常用方法如下：

- **添加元素**: 使用 `Add` 方法添加单个元素，使用 `AddRange` 方法添加多个元素。
- **插入元素**: 使用 `Insert` 方法在指定位置插入元素。
- **删除元素**: 使用 `Remove` 方法删除指定元素，使用 `RemoveAt` 方法删除指定位置的元素。
- **查找元素**: 使用 `Contains` 方法检查集合中是否包含指定元素，使用 `IndexOf` 方法获取元素

```c#
// 添加多个元素
names.AddRange(new List<string> { "Eve", "Frank" });

// 在指定位置插入元素
names.Insert(1, "Grace");

// 删除指定元素
names.Remove("Bob");

// 删除指定位置的元素
names.RemoveAt(0);

// 查找元素
bool containsAlice = names.Contains("Alice");
int indexOfFrank = names.IndexOf("Frank");
Console.WriteLine($"Contains Alice: {containsAlice}");
Console.WriteLine($"Index of Frank: {indexOfFrank}");
```

> c#中模板表达式是用$"{variable}"来表达，和js中的\` ${variable} \`类似

#### Dictionary

```c#
using System;
using System.Collections.Generic;
class Program
{
	static void Main()
	{
		// 定义和初始化
		Dictionary<int, string> employees = new Dictionary<int, string>
		{
			{ 1, "Alice" },
			{ 2, "Bob" },
			{ 3, "Charlie" }
		};
		
		// 添加键值对
		employees.Add(4, "Dave");
		
		// 访问值
		Console.WriteLine(employees[2]); // 输出：Bob
		
		// 遍历字典
		foreach (var kvp in employees)
		{
			Console.WriteLine($"ID: {kvp.Key}, Name: {kvp.Value}");
		}
	}
}
```

类似操作方法如下：

```c#
// 添加键值对
employees.Add(5, "Eve");

// 删除指定键的键值对
employees.Remove(1);

// 查找键值对
bool containsKey2 = employees.ContainsKey(2);

if (employees.TryGetValue(3, out string value))
{
	Console.WriteLine($"Key 3 maps to value: {value}");
}

Console.WriteLine($"Contains Key 2: {containsKey2}");
```