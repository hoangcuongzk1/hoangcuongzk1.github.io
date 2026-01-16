---
title: C# Factories
creation date: 2026-01-16T01:26:00
slug: post-number
series: csharp
excerpt: So sánh các phương pháp xây dựng Factory.
lang: vn
cover img: https://media.geeksforgeeks.org/wp-content/uploads/20240402150351/Factory-Method-Design-Pattern-.webp
tags:
  - csharp
---

## Mở bài
Trong quá trình khởi tạo một instance, ta thường có 2 nhu cầu chính:
- Có param(parameterized)
- Không có param(parameterless)

Trong bài viết này, tôi sẽ tập trung vào việc xây dựng các loại Factory khác nhau nhằm phục vụ 2 nhu cầu trên. Đồng thời xem xét xem phương pháp nào là đem lại hiệu năng tốt nhất.

## Test Objects

Chúng ta sẽ sử dụng 2 class sau để làm đối tượng test.

```csharp
/// <summary>  
/// test Parameterless  
/// </summary>  
public class TestClass  
{  
    public int Value { get; set; }  
    public static TestClass Create() => new TestClass();  
}  
  
/// <summary>  
/// test Parameterized  
/// </summary>  
public class Product  
{  
    public string Name { get; set; }  
    public decimal Price { get; set; }  
    public int Quantity { get; set; }  
  
    public Product() { Name = "Default"; Price = 0; Quantity = 0; }  
    public Product(string name) { Name = name; Price = 0; Quantity = 0; }  
    public Product(string name, decimal price) { Name = name; Price = price; Quantity = 0; }  
    public Product(string name, decimal price, int quantity)   
    {   
Name = name;   
Price = price;   
Quantity = quantity;   
    }  
  
    public override string ToString() => $"{Name} - ${Price} x {Quantity}";  
}
```

Để so sánh hiệu năng giữa các phương pháp, ta sử dụng `new()` để làm mốc:

```csharp
var iterations = 10_000_000;  
for (int i = 0; i < iterations; i++)  
{  
    var obj = new TestClass();  
}
```

## Parameterless

### Activator

```csharp
for (int i = 0; i < iterations; i++)  
{  
    var obj = Activator.CreateInstance<TestClass>();  
}
```

### Expression Tree
```csharp
public static class Factory<T> where T : new()  
{  
    private static readonly Func<T> _creator =   
Expression.Lambda<Func<T>>(Expression.New(typeof(T))).Compile();  
  
    [MethodImpl(MethodImplOptions.AggressiveInlining)]  
    public static T Create() => _creator();  
}
```

### IL Emit

```csharp
public static class ILFactory<T> where T : new()  
{  
    private static readonly Func<T> _CREATOR;  
  
    static ILFactory()  
    {        var dm = new DynamicMethod(  
                                   "Create_" + typeof(T).Name,  
                                   typeof(T),  
                                   Type.EmptyTypes,  
                                   typeof(ILFactory<T>).Module,  
                                   skipVisibility: true);  
  
        var il = dm.GetILGenerator();  
        var ctor = typeof(T).GetConstructor(  
                                            BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance,  
                                            null,  
                                            Type.EmptyTypes,  
                                            null);  
  
        if (ctor == null)  
            throw new InvalidOperationException($"{typeof(T).Name} không có parameterless constructor");  
  
        il.Emit(OpCodes.Newobj, ctor);  
        il.Emit(OpCodes.Ret);  
  
        _CREATOR= (Func<T>)dm.CreateDelegate(typeof(Func<T>));  
    }  
  
    [MethodImpl(MethodImplOptions.AggressiveInlining)]  
    public static T Create() => _CREATOR();  
}
```


## Parameterized

### IL Emit
```cs
public static class ParameterizedILFactory<T>  
{  
    private static readonly ConcurrentDictionary<string, Delegate> _cache = new();  
  
    // 1 parameter - sử dụng IL Emit  
    [MethodImpl(MethodImplOptions.AggressiveInlining)]  
    public static T Create<TArg>(TArg arg)  
    {        var key = $"1_{typeof(TArg).Name}";  
        var factory = (Func<TArg, T>)_cache.GetOrAdd(key, _ => BuildFactory1<TArg>());  
        return factory(arg);  
    }  
    // 2 parameters - sử dụng IL Emit  
    [MethodImpl(MethodImplOptions.AggressiveInlining)]  
    public static T Create<TArg1, TArg2>(TArg1 arg1, TArg2 arg2)  
    {        var key = $"2_{typeof(TArg1).Name}_{typeof(TArg2).Name}";  
        var factory = (Func<TArg1, TArg2, T>)_cache.GetOrAdd(key, _ => BuildFactory2<TArg1, TArg2>());  
        return factory(arg1, arg2);  
    }  
    // 3 parameters - sử dụng IL Emit  
    [MethodImpl(MethodImplOptions.AggressiveInlining)]  
    public static T Create<TArg1, TArg2, TArg3>(TArg1 arg1, TArg2 arg2, TArg3 arg3)  
    {        var key = $"3_{typeof(TArg1).Name}_{typeof(TArg2).Name}_{typeof(TArg3).Name}";  
        var factory = (Func<TArg1, TArg2, TArg3, T>)_cache.GetOrAdd(key, _ => BuildFactory3<TArg1, TArg2, TArg3>());  
        return factory(arg1, arg2, arg3);  
    }  
    private static Delegate BuildFactory1<TArg>()  
    {        var dm = new DynamicMethod(  
            "Create_" + typeof(T).Name,  
            typeof(T),  
            new[] { typeof(TArg) },  
            typeof(ParameterizedILFactory<T>).Module,  
            skipVisibility: true);  
  
        var il = dm.GetILGenerator();  
        var ctor = typeof(T).GetConstructor(  
            BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance,  
            null,  
            new[] { typeof(TArg) },  
            null);  
  
        if (ctor == null)  
            throw new InvalidOperationException($"Constructor {typeof(T).Name}({typeof(TArg).Name}) không tồn tại");  
  
        il.Emit(OpCodes.Ldarg_0);  
        il.Emit(OpCodes.Newobj, ctor);  
        il.Emit(OpCodes.Ret);  
  
        return dm.CreateDelegate(typeof(Func<TArg, T>));  
    }  
    private static Delegate BuildFactory2<TArg1, TArg2>()  
    {        var dm = new DynamicMethod(  
            "Create_" + typeof(T).Name,  
            typeof(T),  
            new[] { typeof(TArg1), typeof(TArg2) },  
            typeof(ParameterizedILFactory<T>).Module,  
            skipVisibility: true);  
  
        var il = dm.GetILGenerator();  
        var ctor = typeof(T).GetConstructor(  
            BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance,  
            null,  
            new[] { typeof(TArg1), typeof(TArg2) },  
            null);  
  
        if (ctor == null)  
            throw new InvalidOperationException($"Constructor không tồn tại");  
  
        il.Emit(OpCodes.Ldarg_0);  
        il.Emit(OpCodes.Ldarg_1);  
        il.Emit(OpCodes.Newobj, ctor);  
        il.Emit(OpCodes.Ret);  
  
        return dm.CreateDelegate(typeof(Func<TArg1, TArg2, T>));  
    }  
    private static Delegate BuildFactory3<TArg1, TArg2, TArg3>()  
    {        var dm = new DynamicMethod(  
            "Create_" + typeof(T).Name,  
            typeof(T),  
            new[] { typeof(TArg1), typeof(TArg2), typeof(TArg3) },  
            typeof(ParameterizedILFactory<T>).Module,  
            skipVisibility: true);  
  
        var il = dm.GetILGenerator();  
        var ctor = typeof(T).GetConstructor(  
            BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance,  
            null,  
            new[] { typeof(TArg1), typeof(TArg2), typeof(TArg3) },  
            null);  
  
        if (ctor == null)  
            throw new InvalidOperationException($"Constructor không tồn tại");  
  
        il.Emit(OpCodes.Ldarg_0);  
        il.Emit(OpCodes.Ldarg_1);  
        il.Emit(OpCodes.Ldarg_2);  
        il.Emit(OpCodes.Newobj, ctor);  
        il.Emit(OpCodes.Ret);  
  
        return dm.CreateDelegate(typeof(Func<TArg1, TArg2, TArg3, T>));  
    }}
```

### Expression Tree

```cs
public static class ParameterizedExpressionFactory<T>  
{  
    private static readonly ConcurrentDictionary<string, Delegate> _cache = new();  
  
    [MethodImpl(MethodImplOptions.AggressiveInlining)]  
    public static T Create<TArg>(TArg arg)  
    {        var key = $"1_{typeof(TArg).Name}";  
        var factory = (Func<TArg, T>)_cache.GetOrAdd(key, _ =>  
        {  
            var ctor = typeof(T).GetConstructor(new[] { typeof(TArg) });  
            if (ctor == null)  
                throw new InvalidOperationException($"Constructor không tồn tại");  
  
            var param = Expression.Parameter(typeof(TArg), "arg");  
            var newExp = Expression.New(ctor, param);  
            return Expression.Lambda<Func<TArg, T>>(newExp, param).Compile();  
        });  
        return factory(arg);  
    }  
    [MethodImpl(MethodImplOptions.AggressiveInlining)]  
    public static T Create<TArg1, TArg2>(TArg1 arg1, TArg2 arg2)  
    {        var key = $"2_{typeof(TArg1).Name}_{typeof(TArg2).Name}";  
        var factory = (Func<TArg1, TArg2, T>)_cache.GetOrAdd(key, _ =>  
        {  
            var ctor = typeof(T).GetConstructor(new[] { typeof(TArg1), typeof(TArg2) });  
            if (ctor == null)  
                throw new InvalidOperationException($"Constructor không tồn tại");  
  
            var param1 = Expression.Parameter(typeof(TArg1), "arg1");  
            var param2 = Expression.Parameter(typeof(TArg2), "arg2");  
            var newExp = Expression.New(ctor, param1, param2);  
            return Expression.Lambda<Func<TArg1, TArg2, T>>(newExp, param1, param2).Compile();  
        });  
        return factory(arg1, arg2);  
    }  
    [MethodImpl(MethodImplOptions.AggressiveInlining)]  
    public static T Create<TArg1, TArg2, TArg3>(TArg1 arg1, TArg2 arg2, TArg3 arg3)  
    {        var key = $"3_{typeof(TArg1).Name}_{typeof(TArg2).Name}_{typeof(TArg3).Name}";  
        var factory = (Func<TArg1, TArg2, TArg3, T>)_cache.GetOrAdd(key, _ =>  
        {  
            var ctor = typeof(T).GetConstructor(new[] { typeof(TArg1), typeof(TArg2), typeof(TArg3) });  
            if (ctor == null)  
                throw new InvalidOperationException($"Constructor không tồn tại");  
  
            var param1 = Expression.Parameter(typeof(TArg1), "arg1");  
            var param2 = Expression.Parameter(typeof(TArg2), "arg2");  
            var param3 = Expression.Parameter(typeof(TArg3), "arg3");  
            var newExp = Expression.New(ctor, param1, param2, param3);  
            return Expression.Lambda<Func<TArg1, TArg2, TArg3, T>>(newExp, param1, param2, param3).Compile();  
        });  
        return factory(arg1, arg2, arg3);  
    }}
```


## Benchmark
```cs
internal class Program  
{  
    static void Main(string[] args)  
    {        Console.WriteLine("╔═══════════════════════════════════════════════════════════╗");  
        Console.WriteLine("║        ULTIMATE FACTORY PATTERN BENCHMARK                 ║");  
        Console.WriteLine("╚═══════════════════════════════════════════════════════════╝\n");  
  
        BenchmarkParameterless();  
        Console.WriteLine();  
        BenchmarkParameterized();  
        Console.WriteLine();  
        TestFactories();  
    }  
    static void BenchmarkParameterless()  
    {        Console.WriteLine("┌─────────────────────────────────────────────────────────┐");  
        Console.WriteLine("│ PARAMETERLESS CONSTRUCTOR (10M iterations)              │");  
        Console.WriteLine("└─────────────────────────────────────────────────────────┘");  
  
        var sw = Stopwatch.StartNew();  
  
        // Baseline - Direct new  
        sw.Restart();  
        var iterations = 10_000_000;  
        for (int i = 0; i < iterations; i++)  
        {            var obj = new TestClass();  
        }        var directTime = sw.ElapsedMilliseconds;  
        Console.WriteLine($"  Direct new():           {directTime,6} ms  (baseline)");  
  
        // IL Emit Factory - NHANH NHẤT  
        sw.Restart();  
        for (int i = 0; i < iterations; i++)  
        {            var obj = ILFactory<TestClass>.Create();  
        }        var ilTime = sw.ElapsedMilliseconds;  
        Console.WriteLine($"  IL Emit Factory:        {ilTime,6} ms  ({(double)directTime/ilTime:F2}x vs baseline)");  
  
        // Expression Factory  
        sw.Restart();  
        for (int i = 0; i < iterations; i++)  
        {            var obj = Factory<TestClass>.Create();  
        }        var exprTime = sw.ElapsedMilliseconds;  
        Console.WriteLine($"  Expression Factory:     {exprTime,6} ms  ({(double)directTime/exprTime:F2}x vs baseline)");  
  
        // Activator  
        sw.Restart();  
        for (int i = 0; i < iterations; i++)  
        {            var obj = Activator.CreateInstance<TestClass>();  
        }        var activatorTime = sw.ElapsedMilliseconds;  
        Console.WriteLine($"  Activator:              {activatorTime,6} ms  ({(double)directTime/activatorTime:F2}x vs baseline)");  
    }  
    static void BenchmarkParameterized()  
    {        Console.WriteLine("┌─────────────────────────────────────────────────────────┐");  
        Console.WriteLine("│ PARAMETERIZED CONSTRUCTOR (1M iterations)               │");  
        Console.WriteLine("└─────────────────────────────────────────────────────────┘");  
  
        var iterations = 1_000_000;  
        var sw = Stopwatch.StartNew();  
  
        // Baseline - Direct new  
        sw.Restart();  
        for (int i = 0; i < iterations; i++)  
        {            var obj = new Product("Product" + i, 99.99m, i);  
        }        var directTime = sw.ElapsedMilliseconds;  
        Console.WriteLine($"  Direct new (3 params):  {directTime,6} ms  (baseline)");  
  
        // IL Emit Optimized Factory - NHANH NHẤT  
        sw.Restart();  
        for (int i = 0; i < iterations; i++)  
        {            var obj = ParameterizedILFactory<Product>.Create("Product" + i, 99.99m, i);  
        }        var ilTime = sw.ElapsedMilliseconds;  
        Console.WriteLine($"  IL Emit Factory:        {ilTime,6} ms  ({(double)directTime/ilTime:F2}x vs baseline)");  
  
        // Expression Factory  
        sw.Restart();  
        for (int i = 0; i < iterations; i++)  
        {            var obj = ParameterizedExpressionFactory<Product>.Create("Product" + i, 99.99m, i);  
        }        var exprTime = sw.ElapsedMilliseconds;  
        Console.WriteLine($"  Expression Factory:     {exprTime,6} ms  ({(double)directTime/exprTime:F2}x vs baseline)");  
  
        // Activator  
        sw.Restart();  
        for (int i = 0; i < iterations; i++)  
        {            var obj = (Product)Activator.CreateInstance(typeof(Product), "Product" + i, 99.99m, i);  
        }        var activatorTime = sw.ElapsedMilliseconds;  
        Console.WriteLine($"  Activator:              {activatorTime,6} ms  ({(double)directTime/activatorTime:F2}x vs baseline)");  
    }  
    static void TestFactories()  
    {        Console.WriteLine("┌─────────────────────────────────────────────────────────┐");  
        Console.WriteLine("│ FUNCTIONALITY TEST                                      │");  
        Console.WriteLine("└─────────────────────────────────────────────────────────┘");  
  
        var p1 = ParameterizedILFactory<Product>.Create("Laptop");  
        Console.WriteLine($"  1 param (IL):   {p1}");  
  
        var p2 = ParameterizedILFactory<Product>.Create("Mouse", 29.99m);  
        Console.WriteLine($"  2 params (IL):  {p2}");  
  
        var p3 = ParameterizedILFactory<Product>.Create("Keyboard", 79.99m, 50);  
        Console.WriteLine($"  3 params (IL):  {p3}");  
  
        var p4 = ParameterizedExpressionFactory<Product>.Create("Monitor", 299.99m, 10);  
        Console.WriteLine($"  3 params (Expr): {p4}");  
    }}
```

Result:

```bash

╔═══════════════════════════════════════════════════════════╗
║        ULTIMATE FACTORY PATTERN BENCHMARK                 ║
╚═══════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────┐
│ PARAMETERLESS CONSTRUCTOR (10M iterations)              │
└─────────────────────────────────────────────────────────┘
  Direct new():               61 ms  (baseline)
  IL Emit Factory:           101 ms  (0.60x vs baseline)
  Expression Factory:         99 ms  (0.62x vs baseline)
  Activator:                 105 ms  (0.58x vs baseline)

┌─────────────────────────────────────────────────────────┐
│ PARAMETERIZED CONSTRUCTOR (1M iterations)               │
└─────────────────────────────────────────────────────────┘
  Direct new (3 params):      33 ms  (baseline)
  IL Emit Factory:           171 ms  (0.19x vs baseline)
  Expression Factory:        149 ms  (0.22x vs baseline)
  Activator:                 492 ms  (0.07x vs baseline)

┌─────────────────────────────────────────────────────────┐
│ FUNCTIONALITY TEST                                      │
└─────────────────────────────────────────────────────────┘
  1 param (IL):   Laptop - $0 x 0
  2 params (IL):  Mouse - $29.99 x 0
  3 params (IL):  Keyboard - $79.99 x 50
  3 params (Expr): Monitor - $299.99 x 10

```

<details>
<summary>Full code</summary>

```cs
using System.Collections.Concurrent;  
using System.Diagnostics;  
using System.Reflection;  
using System.Reflection.Emit;  
using System.Linq.Expressions;  
using System.Runtime.CompilerServices;  
  
namespace ConsoleApp  
{  
    // ============================================  
    // GIẢI PHÁP 1: Expression Trees + Static Cache    // ============================================  
    public static class Factory<T> where T : new()  
    {        private static readonly Func<T> _creator =   
Expression.Lambda<Func<T>>(Expression.New(typeof(T))).Compile();  
            [MethodImpl(MethodImplOptions.AggressiveInlining)]  
        public static T Create() => _creator();  
    }    // ============================================  
    // GIẢI PHÁP 2: IL Emit    // ============================================  
    public static class ILFactory<T> where T : new()  
    {        private static readonly Func<T> _CREATOR;  
  
        static ILFactory()  
        {            var dm = new DynamicMethod(  
                                       "Create_" + typeof(T).Name,  
                                       typeof(T),  
                                       Type.EmptyTypes,  
                                       typeof(ILFactory<T>).Module,  
                                       skipVisibility: true);  
  
            var il = dm.GetILGenerator();  
            var ctor = typeof(T).GetConstructor(  
                                                BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance,  
                                                null,  
                                                Type.EmptyTypes,  
                                                null);  
  
            if (ctor == null)  
                throw new InvalidOperationException($"{typeof(T).Name} không có parameterless constructor");  
  
            il.Emit(OpCodes.Newobj, ctor);  
            il.Emit(OpCodes.Ret);  
  
            _CREATOR= (Func<T>)dm.CreateDelegate(typeof(Func<T>));  
        }     
        [MethodImpl(MethodImplOptions.AggressiveInlining)]  
        public static T Create() => _CREATOR();  
    }  
    // ============================================  
    // GIẢI PHÁP 3: Parameterized Factory với IL Emit    // ============================================    public static class ParameterizedILFactory<T>  
    {        private static readonly ConcurrentDictionary<string, Delegate> _cache = new();  
  
        // 1 parameter - sử dụng IL Emit  
        [MethodImpl(MethodImplOptions.AggressiveInlining)]  
        public static T Create<TArg>(TArg arg)  
        {            var key = $"1_{typeof(TArg).Name}";  
            var factory = (Func<TArg, T>)_cache.GetOrAdd(key, _ => BuildFactory1<TArg>());  
            return factory(arg);  
        }  
        // 2 parameters - sử dụng IL Emit  
        [MethodImpl(MethodImplOptions.AggressiveInlining)]  
        public static T Create<TArg1, TArg2>(TArg1 arg1, TArg2 arg2)  
        {            var key = $"2_{typeof(TArg1).Name}_{typeof(TArg2).Name}";  
            var factory = (Func<TArg1, TArg2, T>)_cache.GetOrAdd(key, _ => BuildFactory2<TArg1, TArg2>());  
            return factory(arg1, arg2);  
        }  
        // 3 parameters - sử dụng IL Emit  
        [MethodImpl(MethodImplOptions.AggressiveInlining)]  
        public static T Create<TArg1, TArg2, TArg3>(TArg1 arg1, TArg2 arg2, TArg3 arg3)  
        {            var key = $"3_{typeof(TArg1).Name}_{typeof(TArg2).Name}_{typeof(TArg3).Name}";  
            var factory = (Func<TArg1, TArg2, TArg3, T>)_cache.GetOrAdd(key, _ => BuildFactory3<TArg1, TArg2, TArg3>());  
            return factory(arg1, arg2, arg3);  
        }  
        private static Delegate BuildFactory1<TArg>()  
        {            var dm = new DynamicMethod(  
                "Create_" + typeof(T).Name,  
                typeof(T),  
                new[] { typeof(TArg) },  
                typeof(ParameterizedILFactory<T>).Module,  
                skipVisibility: true);  
  
            var il = dm.GetILGenerator();  
            var ctor = typeof(T).GetConstructor(  
                BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance,  
                null,  
                new[] { typeof(TArg) },  
                null);  
  
            if (ctor == null)  
                throw new InvalidOperationException($"Constructor {typeof(T).Name}({typeof(TArg).Name}) không tồn tại");  
  
            il.Emit(OpCodes.Ldarg_0);  
            il.Emit(OpCodes.Newobj, ctor);  
            il.Emit(OpCodes.Ret);  
  
            return dm.CreateDelegate(typeof(Func<TArg, T>));  
        }  
        private static Delegate BuildFactory2<TArg1, TArg2>()  
        {            var dm = new DynamicMethod(  
                "Create_" + typeof(T).Name,  
                typeof(T),  
                new[] { typeof(TArg1), typeof(TArg2) },  
                typeof(ParameterizedILFactory<T>).Module,  
                skipVisibility: true);  
  
            var il = dm.GetILGenerator();  
            var ctor = typeof(T).GetConstructor(  
                BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance,  
                null,  
                new[] { typeof(TArg1), typeof(TArg2) },  
                null);  
  
            if (ctor == null)  
                throw new InvalidOperationException($"Constructor không tồn tại");  
  
            il.Emit(OpCodes.Ldarg_0);  
            il.Emit(OpCodes.Ldarg_1);  
            il.Emit(OpCodes.Newobj, ctor);  
            il.Emit(OpCodes.Ret);  
  
            return dm.CreateDelegate(typeof(Func<TArg1, TArg2, T>));  
        }  
        private static Delegate BuildFactory3<TArg1, TArg2, TArg3>()  
        {            var dm = new DynamicMethod(  
                "Create_" + typeof(T).Name,  
                typeof(T),  
                new[] { typeof(TArg1), typeof(TArg2), typeof(TArg3) },  
                typeof(ParameterizedILFactory<T>).Module,  
                skipVisibility: true);  
  
            var il = dm.GetILGenerator();  
            var ctor = typeof(T).GetConstructor(  
                BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance,  
                null,  
                new[] { typeof(TArg1), typeof(TArg2), typeof(TArg3) },  
                null);  
  
            if (ctor == null)  
                throw new InvalidOperationException($"Constructor không tồn tại");  
  
            il.Emit(OpCodes.Ldarg_0);  
            il.Emit(OpCodes.Ldarg_1);  
            il.Emit(OpCodes.Ldarg_2);  
            il.Emit(OpCodes.Newobj, ctor);  
            il.Emit(OpCodes.Ret);  
  
            return dm.CreateDelegate(typeof(Func<TArg1, TArg2, TArg3, T>));  
        }    }  
    // ============================================  
    // GIẢI PHÁP 4: Compiled Expression với tối ưu cao hơn    // ============================================    public static class ParameterizedExpressionFactory<T>  
    {        private static readonly ConcurrentDictionary<string, Delegate> _cache = new();  
  
        [MethodImpl(MethodImplOptions.AggressiveInlining)]  
        public static T Create<TArg>(TArg arg)  
        {            var key = $"1_{typeof(TArg).Name}";  
            var factory = (Func<TArg, T>)_cache.GetOrAdd(key, _ =>  
            {  
                var ctor = typeof(T).GetConstructor(new[] { typeof(TArg) });  
                if (ctor == null)  
                    throw new InvalidOperationException($"Constructor không tồn tại");  
  
                var param = Expression.Parameter(typeof(TArg), "arg");  
                var newExp = Expression.New(ctor, param);  
                return Expression.Lambda<Func<TArg, T>>(newExp, param).Compile();  
            });  
            return factory(arg);  
        }  
        [MethodImpl(MethodImplOptions.AggressiveInlining)]  
        public static T Create<TArg1, TArg2>(TArg1 arg1, TArg2 arg2)  
        {            var key = $"2_{typeof(TArg1).Name}_{typeof(TArg2).Name}";  
            var factory = (Func<TArg1, TArg2, T>)_cache.GetOrAdd(key, _ =>  
            {  
                var ctor = typeof(T).GetConstructor(new[] { typeof(TArg1), typeof(TArg2) });  
                if (ctor == null)  
                    throw new InvalidOperationException($"Constructor không tồn tại");  
  
                var param1 = Expression.Parameter(typeof(TArg1), "arg1");  
                var param2 = Expression.Parameter(typeof(TArg2), "arg2");  
                var newExp = Expression.New(ctor, param1, param2);  
                return Expression.Lambda<Func<TArg1, TArg2, T>>(newExp, param1, param2).Compile();  
            });  
            return factory(arg1, arg2);  
        }  
        [MethodImpl(MethodImplOptions.AggressiveInlining)]  
        public static T Create<TArg1, TArg2, TArg3>(TArg1 arg1, TArg2 arg2, TArg3 arg3)  
        {            var key = $"3_{typeof(TArg1).Name}_{typeof(TArg2).Name}_{typeof(TArg3).Name}";  
            var factory = (Func<TArg1, TArg2, TArg3, T>)_cache.GetOrAdd(key, _ =>  
            {  
                var ctor = typeof(T).GetConstructor(new[] { typeof(TArg1), typeof(TArg2), typeof(TArg3) });  
                if (ctor == null)  
                    throw new InvalidOperationException($"Constructor không tồn tại");  
  
                var param1 = Expression.Parameter(typeof(TArg1), "arg1");  
                var param2 = Expression.Parameter(typeof(TArg2), "arg2");  
                var param3 = Expression.Parameter(typeof(TArg3), "arg3");  
                var newExp = Expression.New(ctor, param1, param2, param3);  
                return Expression.Lambda<Func<TArg1, TArg2, TArg3, T>>(newExp, param1, param2, param3).Compile();  
            });  
            return factory(arg1, arg2, arg3);  
        }    }  
    /// <summary>  
    /// test Parameterless    /// </summary>    public class TestClass  
    {  
        public int Value { get; set; }  
        public static TestClass Create() => new TestClass();  
    }  
    /// <summary>  
    /// test Parameterized    /// </summary>    public class Product  
    {  
        public string Name { get; set; }  
        public decimal Price { get; set; }  
        public int Quantity { get; set; }  
  
        public Product() { Name = "Default"; Price = 0; Quantity = 0; }  
        public Product(string name) { Name = name; Price = 0; Quantity = 0; }  
        public Product(string name, decimal price) { Name = name; Price = price; Quantity = 0; }  
        public Product(string name, decimal price, int quantity)   
        {   
Name = name;   
Price = price;   
Quantity = quantity;   
        }  
  
        public override string ToString() => $"{Name} - ${Price} x {Quantity}";  
    }  
    // ============================================  
    // Benchmark Program    // ============================================    internal class Program  
    {  
        static void Main(string[] args)  
        {            Console.WriteLine("╔═══════════════════════════════════════════════════════════╗");  
            Console.WriteLine("║        ULTIMATE FACTORY PATTERN BENCHMARK                 ║");  
            Console.WriteLine("╚═══════════════════════════════════════════════════════════╝\n");  
  
            BenchmarkParameterless();  
            Console.WriteLine();  
            BenchmarkParameterized();  
            Console.WriteLine();  
            TestFactories();  
        }  
        static void BenchmarkParameterless()  
        {            Console.WriteLine("┌─────────────────────────────────────────────────────────┐");  
            Console.WriteLine("│ PARAMETERLESS CONSTRUCTOR (10M iterations)              │");  
            Console.WriteLine("└─────────────────────────────────────────────────────────┘");  
  
            var sw = Stopwatch.StartNew();  
  
            // Baseline - Direct new  
            sw.Restart();  
            var iterations = 10_000_000;  
            for (int i = 0; i < iterations; i++)  
            {                var obj = new TestClass();  
            }            var directTime = sw.ElapsedMilliseconds;  
            Console.WriteLine($"  Direct new():           {directTime,6} ms  (baseline)");  
  
            // IL Emit Factory - NHANH NHẤT  
            sw.Restart();  
            for (int i = 0; i < iterations; i++)  
            {                var obj = ILFactory<TestClass>.Create();  
            }            var ilTime = sw.ElapsedMilliseconds;  
            Console.WriteLine($"  IL Emit Factory:        {ilTime,6} ms  ({(double)directTime/ilTime:F2}x vs baseline)");  
  
            // Expression Factory  
            sw.Restart();  
            for (int i = 0; i < iterations; i++)  
            {                var obj = Factory<TestClass>.Create();  
            }            var exprTime = sw.ElapsedMilliseconds;  
            Console.WriteLine($"  Expression Factory:     {exprTime,6} ms  ({(double)directTime/exprTime:F2}x vs baseline)");  
  
            // Activator  
            sw.Restart();  
            for (int i = 0; i < iterations; i++)  
            {                var obj = Activator.CreateInstance<TestClass>();  
            }            var activatorTime = sw.ElapsedMilliseconds;  
            Console.WriteLine($"  Activator:              {activatorTime,6} ms  ({(double)directTime/activatorTime:F2}x vs baseline)");  
        }  
        static void BenchmarkParameterized()  
        {            Console.WriteLine("┌─────────────────────────────────────────────────────────┐");  
            Console.WriteLine("│ PARAMETERIZED CONSTRUCTOR (1M iterations)               │");  
            Console.WriteLine("└─────────────────────────────────────────────────────────┘");  
  
            var iterations = 1_000_000;  
            var sw = Stopwatch.StartNew();  
  
            // Baseline - Direct new  
            sw.Restart();  
            for (int i = 0; i < iterations; i++)  
            {                var obj = new Product("Product" + i, 99.99m, i);  
            }            var directTime = sw.ElapsedMilliseconds;  
            Console.WriteLine($"  Direct new (3 params):  {directTime,6} ms  (baseline)");  
  
            // IL Emit Optimized Factory - NHANH NHẤT  
            sw.Restart();  
            for (int i = 0; i < iterations; i++)  
            {                var obj = ParameterizedILFactory<Product>.Create("Product" + i, 99.99m, i);  
            }            var ilTime = sw.ElapsedMilliseconds;  
            Console.WriteLine($"  IL Emit Factory:        {ilTime,6} ms  ({(double)directTime/ilTime:F2}x vs baseline)");  
  
            // Expression Factory  
            sw.Restart();  
            for (int i = 0; i < iterations; i++)  
            {                var obj = ParameterizedExpressionFactory<Product>.Create("Product" + i, 99.99m, i);  
            }            var exprTime = sw.ElapsedMilliseconds;  
            Console.WriteLine($"  Expression Factory:     {exprTime,6} ms  ({(double)directTime/exprTime:F2}x vs baseline)");  
  
            // Activator  
            sw.Restart();  
            for (int i = 0; i < iterations; i++)  
            {                var obj = (Product)Activator.CreateInstance(typeof(Product), "Product" + i, 99.99m, i);  
            }            var activatorTime = sw.ElapsedMilliseconds;  
            Console.WriteLine($"  Activator:              {activatorTime,6} ms  ({(double)directTime/activatorTime:F2}x vs baseline)");  
        }  
        static void TestFactories()  
        {            Console.WriteLine("┌─────────────────────────────────────────────────────────┐");  
            Console.WriteLine("│ FUNCTIONALITY TEST                                      │");  
            Console.WriteLine("└─────────────────────────────────────────────────────────┘");  
  
            var p1 = ParameterizedILFactory<Product>.Create("Laptop");  
            Console.WriteLine($"  1 param (IL):   {p1}");  
  
            var p2 = ParameterizedILFactory<Product>.Create("Mouse", 29.99m);  
            Console.WriteLine($"  2 params (IL):  {p2}");  
  
            var p3 = ParameterizedILFactory<Product>.Create("Keyboard", 79.99m, 50);  
            Console.WriteLine($"  3 params (IL):  {p3}");  
  
            var p4 = ParameterizedExpressionFactory<Product>.Create("Monitor", 299.99m, 10);  
            Console.WriteLine($"  3 params (Expr): {p4}");  
        }    }}
```

</details>