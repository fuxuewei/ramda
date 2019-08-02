require('../../support');
var _ = require('ramda');
var accounting = require('accounting');

// 示例数据
var CARS = [
    {name: "Ferrari FF", horsepower: 660, dollar_value: 700000, in_stock: true},
    {name: "Spyker C12 Zagato", horsepower: 650, dollar_value: 648000, in_stock: false},
    {name: "Jaguar XKR-S", horsepower: 550, dollar_value: 132000, in_stock: false},
    {name: "Audi R8", horsepower: 525, dollar_value: 114200, in_stock: false},
    {name: "Aston Martin One-77", horsepower: 750, dollar_value: 1850000, in_stock: true},
    {name: "Pagani Huayra", horsepower: 700, dollar_value: 1300000, in_stock: false}
  ];

// 练习 1:
// ============
// 使用 _.compose() 重写下面这个函数。提示：_.prop() 是 curry 函数
var isLastInStock = function(cars) {
  var last_car = _.last(cars);
  return _.prop('in_stock', last_car);
};

var isLastInStock = _.compose(_.prop('in_stock'),_.last)

// 练习 2:
// ============
// 使用 _.compose()、_.prop() 和 _.head() 获取第一个 car 的 name
var nameOfFirstCar = undefined;
var nameOfFirstCar = _.compose(_.prop('name'),_.head)

// 练习 3:
// ============
// 使用帮助函数 _average 重构 averageDollarValue 使之成为一个组合
var _average = function(xs) { return reduce(add, 0, xs) / xs.length; }; // <- 无须改动

var averageDollarValue = function(cars) {
  var dollar_values = map(function(c) { return c.dollar_value; }, cars);
  return _average(dollar_values);
};

var averageDollarValue = _.compose(_average,_.map(_.prop('dollar_values')))
// 练习 4:
// ============
// 使用 compose 写一个 sanitizeNames() 函数，返回一个下划线连接的小写字符串：例如：sanitizeNames(["Hello World"]) //=> ["hello_world"]。

var _underscore = replace(/\W+/g, '_'); //<-- 无须改动，并在 sanitizeNames 中使用它

var sanitizeNames = _.map(_.compose(_underscore,toLowerCase,_.prop('name')))


// 彩蛋 1:
// ============
// 使用 compose 重构 availablePrices

var availablePrices = function(cars) {
  var available_cars = _.filter(_.prop('in_stock'), cars);
  return available_cars.map(function(x){
    return accounting.formatMoney(x.dollar_value);
  }).join(', ');
};

var formatPrice = _.compose(accounting.formatMoney, _.prop('dollar_value'));
var availablePrices = _.compose(join(', '), _.map(formatPrice), _.filter(_.prop('in_stock')));

// 彩蛋 2:
// ============
// 重构使之成为 pointfree 函数。提示：可以使用 _.flip()

var fastestCar = function(cars) {
  var sorted = _.sortBy(function(car){ return car.horsepower }, cars);
  var fastest = _.last(sorted);
  return fastest.name + ' is the fastest';
};


var append = _.flip(_.concat);
var fastestCar = _.compose(append(' is the fastest'),
                           _.prop('name'),
                           _.last,
                           _.sortBy(_.prop('horsepower')));




// 命令式
var makes = [];
for (i = 0; i < cars.length; i++) {
  makes.push(cars[i].make);
}


// 声明式
var makes = cars.map(function(car){ return car.make; });

//结合律
var mediaUrl = _.compose(_.prop('m'),_.prop('media'))
var images = _.compose(_.map(img),_.map(mediaUrl),_.prop('items'))
var images = _.compose(_.map(_.compose(img,mediaUrl)),_.prop('items'))

//提高可读性
var mediaUrl = _.compose(_.prop('m'),_.prop('media'))
var  mediaToImg = _.compose(img,mediaUrl)
var images = _.compose(_.map(mediaToImg),_.prop('items'))

//接口 interface

// 容器 是个只有一个属性(__value)的对象
// __value不能是某个特定的类型
var Container =function(){
    this.__value = x
}
//构造器 （constructor）
Container.of = function(x){
    return new Container(x)
}

//functor 是实现了 map 函数并遵守一些特定规则的容器类型。


//forEach：集合迭代函数，没有返回，一般在有副作用的函数调用中
_.forEach(value => console.log(value),myArray)

//map：集合迭代函数，将函数的每个返回值组成新数组
_.map(x=>x*2,[1,2,3])  //=>[2,4,6]

//fliter：返回符合条件的值的集合
//reject：返回不符合条件的值
const isEven = x=> x%2===0
_.filter(isEven,[1,2,3,4])  //=>[2,4]
_.reject(isEven,[1,2,3,4])  //=>[1,3]

//find：返回第一个符合条件的值
_.find(isEven,[1,2,3,4])  //=> 2

//reduce：集合迭代函数
//第一个参数function(a,b)
//第二个参数：初始值，
//第三个参数：待处理的数组
const add = (accum, value)=> accum+value
_.reject(add,5,[1,2,3,4]) //=>15

//complement：传入函数，返回一个新函数是原函数的反函数
_.find(_.complement(isEvent),[1,2,3,4])  //=>1
const isOdd = _.complement(isEven)
_.find(isOdd,[1,2,3,4])  //=>1

//pipelines：管道 函数链式调用
const multiply = (a,b) => a*b
const addOne = x => x+1
const square = x => x*x

const operate = (x,y)=>{
    const product = multiply(x,y)
    const incremented = addOne(product)
    const squared = square(incremented)
    return squared
}

operate(3,4)  //=>(3*4+1)^2=169

//pipe：接受一系列并返回一个新函数
//新函数的元数（参数个数）和第一个传入函数的相同
//除首个函数外，其余的函数都是一元函数
//用 _.pipe 简化上面的 operate 函数
const operate = _.pipe(multiply,addOne,square)

//compose：和 _.pipe 基本相同
//调用函数的顺序是从右到左（与 _.pipe 相反）
//除了最后一个，其余都是一元函数
const operate = _.compose(squared,addOne,multiply)

//partial  ||  partialRight
//不必一次传递所有需要的参数，也可以调用函数
//返回一个接受剩余参数的新函数
//为被 partial 和 partialRight 包裹的函数提供的参数必须包裹在数组中，即使只有一个参数
const publishedInYear = (book,year) => book.year === year
const titlesForYear = (books,year) => {
    const selected = _.fliter(_.partialRight(publishedInYear,[year]),books)
    return map(book=>book.title,selected)
}

//currying：像 partial ，没有 partialRight 版本的 currying
const publishedInYear = _.curry((year,book) => book.year === year)
const titlesForYear = (books,year) => {
    const selected = _.fliter(publishedInYear(year),books)
    return map(book=>book.title,selected)
}

//flip：接受一个多元函数，调换函数前两个参数位置
const publishedInYear = _.curry((book,year) => book.year === year)
const titlesForYear = (books,year) => {
    const selected = _.fliter(_.flip(publishedInYear)(year),books)
    return map(book=>book.title,selected)
}

//__占位符：适用于柯里化函数
const publishedInYear = _.curry((book,year)=> book.year === year)
const titlesForYear = (books,year) => {
    const selected = _.filter(publishedInYear(__,year),books)
    return map(book=>book.title,selected)
}

//管道式
const publishedInYear = _.curry((year,book) => book.year === year)
const titlesForYear = _.curry((year,books) => 
    _.pipe(
        _.filter(publishedInYear(year)),
        map(book => book.title)
    )(books)
)


//pointfree 无参数风格(隐含式编程)：使代码更清晰且易于理解
const forever21 = _.ifElse(_.gte(__,21),_.always(21),inc)
//等同于
const forever21 = age => _.ifElse(_.gte(__, 21), _.always(21), inc)(age)

const wasBornInCountry = person => _.equals(person.birthCountry, OUR_COUNTRY)
const wasNaturalized = person => Boolean(person.naturalizationDate)
const isOver18 = person => _.gte(person.age, 18)
const isCitizen = _.either(wasBornInCountry, wasNaturalized)
const isEligibleToVote = _.both(isOver18, isCitizen)
//等同于
const wasBornInCountry = person => person.birthCountry === OUR_COUNTRY
const wasNaturalized = person => Boolean(person.naturalizationDate)
const isOver18 = person => person.age >= 18
const isCitizen = person => wasBornInCountry(person) || wasNaturalized(person)
const isEligibleToVote = person => isOver18(person) && isCitizen(person)




//读取对象的函数 start
//prop
const wasBornInCountry = _.compose(_.equals(OUR_COUNTRY),_.prop('birthCountry'))
const wasNaturalized = _.compose(Boolean,_.prop('naturalizationDate'))
const isOver18 = _.compose(_.gte(__,18),_.prop('age'))

//pick 读取对象的多个属性
_.pick(['name', 'age'], person)

//path 读取对象的嵌套属性
//path 的容错性更强
//如果路径上的任意属性为 null 或 undefined，则 path 返回 undefined，而 prop 会引发错误
_.path(['address', 'zipCode'], person)

//propOr / pathOr 允许提供默认值
_.propOr('<Unnamed>', 'name', person)

//keys / values 返回包含对象中所有属性名称的数组


//evolve 属性转换 可以一次转换多个属性，还可以进行嵌套转换
//evolve 不会添加新属性，如果为目标对象不存在的属性指定转换函数，evolve 会将其忽略
const nextAge = _.compose(inc, prop('age'))
const celebrateBirthday = _.evolve({ age: inc })
//等同于 assoc 改 
const celebrateBirthday = person => _.assoc('age', nextAge(person), person)


//merge 合并对象 返回一个包含两个对象的所有属性和值的新对象
//只接受两个参数，合并多个 mergeAll
//如果两个对象具有相同的属性，则采用第二个对象参数的属性值
//浅合并，不会对子对象进行嵌套合并
//mergeDeep 深合并（v0.24.0 中加入）
function f(a, b, options = {}) {
    const defaultOptions = { value: 42, local: true }
    const finalOptions = _.merge(defaultOptions, options)
  }
//读取对象的函数 end





//读取数组的函数 start
const numbers = [10,20,30,40,50,60]
//nth  类似  prop
_.nth(3,numbers)  //=>40
_.nth(-2,numbers) //=>50

//slice  类似  pick
_.slice(2,5,numbers) //=>[30,40,50]

//contains  类似  has
_.contains(20,numbers)  //=>true

//head：访问首个元素
_.head(numbers) //=> 10

//last：访问最后一个元素
_.last(numbers) //=>60

//tail 访问除去首个元素的所有
_.tail(numbers) //=>[20,30,40,50,60]

//init 访问除去最后一个元素的所有
_.init(numbers) //=>[10,20,30,40,50]

//take(n) 前n个元素  || takeLast(n) 后n个元素
_.take(3,numbers) //=>[10,20,30]
_.takeLast(3,numbers) //=>[40,50,60]


//数组的增删改查
const numbers = [10, 20, 30, 40, 50, 60]

//增：insert 插入 || append 末尾增加 ||prepend 首位增加 || update 替换
_.insert(3, 35, numbers) // => [10, 20, 30, 35, 40, 50, 60]
_.append(70, numbers) // => [10, 20, 30, 40, 50, 60, 70]
_.prepend(0, numbers) // => [0, 10, 20, 30, 40, 50, 60]
_.update(1, 15, numbers) // => [10, 15, 30, 40, 50, 60]

//concat 数组合并
_.concat(numbers, [70, 80, 90]) // => [10, 20, 30, 40, 50, 60, 70, 80, 90]

//删：remove 移除部分 || without 批量移除 || drop 删除前n个 || dropLast 删除后n个
_.remove(2, 3, numbers) // => [10, 20, 60]
_.without([30, 40, 50], numbers) // => [10, 20, 60]
_.drop(3, numbers) // => [40, 50, 60]
_.dropLast(3, numbers) // => [10, 20, 30]

//改：adjust
_.adjust(_.multiply(10),2,numbers)
