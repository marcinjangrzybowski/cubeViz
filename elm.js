(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_enqueueEffects(managers, result.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});




// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$MicroAgda$Viz$Gui$initInspectorModel = {};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$ReadFile = function (a) {
	return {$: 'ReadFile', a: a};
};
var $author$project$Main$readFileTask = function (upf) {
	return A2(
		$elm$core$Task$perform,
		$elm$core$Basics$identity,
		$elm$core$Task$succeed(
			$author$project$Main$ReadFile(upf)));
};
var $author$project$Main$ShowDiagram = function (a) {
	return {$: 'ShowDiagram', a: a};
};
var $author$project$Main$setInspectedDefName = function (defName) {
	return A2(
		$elm$core$Task$perform,
		$elm$core$Basics$identity,
		$elm$core$Task$succeed(
			$author$project$Main$ShowDiagram(defName)));
};
var $author$project$Main$readFileAndShowTask = F2(
	function (fName, defName) {
		return $elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[
					$author$project$Main$readFileTask(fName),
					$author$project$Main$setInspectedDefName(defName)
				]));
	});
var $author$project$Main$newHashToCmd = A2(
	$elm$core$Basics$composeR,
	$elm$core$String$dropLeft(1),
	A2(
		$elm$core$Basics$composeR,
		$elm$core$String$split(','),
		function (l) {
			_v0$2:
			while (true) {
				if (l.b) {
					if (!l.b.b) {
						var fName = l.a;
						return $author$project$Main$readFileTask(fName);
					} else {
						if (!l.b.b.b) {
							var fName = l.a;
							var _v1 = l.b;
							var defName = _v1.a;
							return A2($author$project$Main$readFileAndShowTask, fName, defName);
						} else {
							break _v0$2;
						}
					}
				} else {
					break _v0$2;
				}
			}
			return $elm$core$Platform$Cmd$none;
		}));
var $author$project$Main$init = function (flags) {
	return _Utils_Tuple2(
		{cachedWinWork: $elm$core$Maybe$Nothing, context: $elm$core$Maybe$Nothing, file: $elm$core$Maybe$Nothing, fullScreenMode: false, inspectorModel: $author$project$MicroAgda$Viz$Gui$initInspectorModel, inspectorSize: $elm$core$Maybe$Nothing, msg: 'initial msg', selectedAddress: $elm$core$Maybe$Nothing, showName: ''},
		$author$project$Main$newHashToCmd(flags));
};
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Main$UpdateInspectorSize = {$: 'UpdateInspectorSize'};
var $elm$browser$Browser$Events$Window = {$: 'Window'};
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 'MySub', a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {pids: pids, subs: subs};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (node.$ === 'Document') {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {event: event, key: key};
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (node.$ === 'Document') {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.pids,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.key;
		var event = _v0.event;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.subs);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onResize = function (func) {
	return A3(
		$elm$browser$Browser$Events$on,
		$elm$browser$Browser$Events$Window,
		'resize',
		A2(
			$elm$json$Json$Decode$field,
			'target',
			A3(
				$elm$json$Json$Decode$map2,
				func,
				A2($elm$json$Json$Decode$field, 'innerWidth', $elm$json$Json$Decode$int),
				A2($elm$json$Json$Decode$field, 'innerHeight', $elm$json$Json$Decode$int))));
};
var $author$project$Main$subscriptions = function (model) {
	return $elm$browser$Browser$Events$onResize(
		F2(
			function (_v0, _v1) {
				return $author$project$Main$UpdateInspectorSize;
			}));
};
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles = F2(
	function (_v0, styles) {
		var newStyles = _v0.b;
		var classname = _v0.c;
		return $elm$core$List$isEmpty(newStyles) ? styles : A3($elm$core$Dict$insert, classname, newStyles, styles);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute = function (_v0) {
	var val = _v0.a;
	return val;
};
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$virtual_dom$VirtualDom$keyedNodeNS = F2(
	function (namespace, tag) {
		return A2(
			_VirtualDom_keyedNodeNS,
			namespace,
			_VirtualDom_noScript(tag));
	});
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$virtual_dom$VirtualDom$nodeNS = function (tag) {
	return _VirtualDom_nodeNS(
		_VirtualDom_noScript(tag));
};
var $rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml = F2(
	function (_v6, _v7) {
		var key = _v6.a;
		var html = _v6.b;
		var pairs = _v7.a;
		var styles = _v7.b;
		switch (html.$) {
			case 'Unstyled':
				var vdom = html.a;
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					styles);
			case 'Node':
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v9 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v9.a;
				var finalStyles = _v9.b;
				var vdom = A3(
					$elm$virtual_dom$VirtualDom$node,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			case 'NodeNS':
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v10 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v10.a;
				var finalStyles = _v10.b;
				var vdom = A4(
					$elm$virtual_dom$VirtualDom$nodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			case 'KeyedNode':
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v11 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v11.a;
				var finalStyles = _v11.b;
				var vdom = A3(
					$elm$virtual_dom$VirtualDom$keyedNode,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			default:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v12 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v12.a;
				var finalStyles = _v12.b;
				var vdom = A4(
					$elm$virtual_dom$VirtualDom$keyedNodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml = F2(
	function (html, _v0) {
		var nodes = _v0.a;
		var styles = _v0.b;
		switch (html.$) {
			case 'Unstyled':
				var vdomNode = html.a;
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					styles);
			case 'Node':
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v2 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v2.a;
				var finalStyles = _v2.b;
				var vdomNode = A3(
					$elm$virtual_dom$VirtualDom$node,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			case 'NodeNS':
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v3 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v3.a;
				var finalStyles = _v3.b;
				var vdomNode = A4(
					$elm$virtual_dom$VirtualDom$nodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			case 'KeyedNode':
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v4 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v4.a;
				var finalStyles = _v4.b;
				var vdomNode = A3(
					$elm$virtual_dom$VirtualDom$keyedNode,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			default:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v5 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v5.a;
				var finalStyles = _v5.b;
				var vdomNode = A4(
					$elm$virtual_dom$VirtualDom$keyedNodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
		}
	});
var $elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$stylesFromPropertiesHelp = F2(
	function (candidate, properties) {
		stylesFromPropertiesHelp:
		while (true) {
			if (!properties.b) {
				return candidate;
			} else {
				var _v1 = properties.a;
				var styles = _v1.b;
				var classname = _v1.c;
				var rest = properties.b;
				if ($elm$core$String$isEmpty(classname)) {
					var $temp$candidate = candidate,
						$temp$properties = rest;
					candidate = $temp$candidate;
					properties = $temp$properties;
					continue stylesFromPropertiesHelp;
				} else {
					var $temp$candidate = $elm$core$Maybe$Just(
						_Utils_Tuple2(classname, styles)),
						$temp$properties = rest;
					candidate = $temp$candidate;
					properties = $temp$properties;
					continue stylesFromPropertiesHelp;
				}
			}
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties = function (properties) {
	var _v0 = A2($rtfeldman$elm_css$VirtualDom$Styled$stylesFromPropertiesHelp, $elm$core$Maybe$Nothing, properties);
	if (_v0.$ === 'Nothing') {
		return $elm$core$Dict$empty;
	} else {
		var _v1 = _v0.a;
		var classname = _v1.a;
		var styles = _v1.b;
		return A2($elm$core$Dict$singleton, classname, styles);
	}
};
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$Basics$not = _Basics_not;
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $rtfeldman$elm_css$Css$Structure$compactHelp = F2(
	function (declaration, _v0) {
		var keyframesByName = _v0.a;
		var declarations = _v0.b;
		switch (declaration.$) {
			case 'StyleBlockDeclaration':
				var _v2 = declaration.a;
				var properties = _v2.c;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'MediaRule':
				var styleBlocks = declaration.b;
				return A2(
					$elm$core$List$all,
					function (_v3) {
						var properties = _v3.c;
						return $elm$core$List$isEmpty(properties);
					},
					styleBlocks) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'SupportsRule':
				var otherDeclarations = declaration.b;
				return $elm$core$List$isEmpty(otherDeclarations) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'DocumentRule':
				return _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'PageRule':
				var properties = declaration.b;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'FontFace':
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'Keyframes':
				var record = declaration.a;
				return $elm$core$String$isEmpty(record.declaration) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					A3($elm$core$Dict$insert, record.name, record.declaration, keyframesByName),
					declarations);
			case 'Viewport':
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'CounterStyle':
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			default:
				var tuples = declaration.a;
				return A2(
					$elm$core$List$all,
					function (_v4) {
						var properties = _v4.b;
						return $elm$core$List$isEmpty(properties);
					},
					tuples) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
		}
	});
var $rtfeldman$elm_css$Css$Structure$Keyframes = function (a) {
	return {$: 'Keyframes', a: a};
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $rtfeldman$elm_css$Css$Structure$withKeyframeDeclarations = F2(
	function (keyframesByName, compactedDeclarations) {
		return A2(
			$elm$core$List$append,
			A2(
				$elm$core$List$map,
				function (_v0) {
					var name = _v0.a;
					var decl = _v0.b;
					return $rtfeldman$elm_css$Css$Structure$Keyframes(
						{declaration: decl, name: name});
				},
				$elm$core$Dict$toList(keyframesByName)),
			compactedDeclarations);
	});
var $rtfeldman$elm_css$Css$Structure$compactStylesheet = function (_v0) {
	var charset = _v0.charset;
	var imports = _v0.imports;
	var namespaces = _v0.namespaces;
	var declarations = _v0.declarations;
	var _v1 = A3(
		$elm$core$List$foldr,
		$rtfeldman$elm_css$Css$Structure$compactHelp,
		_Utils_Tuple2($elm$core$Dict$empty, _List_Nil),
		declarations);
	var keyframesByName = _v1.a;
	var compactedDeclarations = _v1.b;
	var finalDeclarations = A2($rtfeldman$elm_css$Css$Structure$withKeyframeDeclarations, keyframesByName, compactedDeclarations);
	return {charset: charset, declarations: finalDeclarations, imports: imports, namespaces: namespaces};
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $rtfeldman$elm_css$Css$Structure$Output$charsetToString = function (charset) {
	return A2(
		$elm$core$Maybe$withDefault,
		'',
		A2(
			$elm$core$Maybe$map,
			function (str) {
				return '@charset \"' + (str + '\"');
			},
			charset));
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString = function (expression) {
	return '(' + (expression.feature + (A2(
		$elm$core$Maybe$withDefault,
		'',
		A2(
			$elm$core$Maybe$map,
			$elm$core$Basics$append(': '),
			expression.value)) + ')'));
};
var $rtfeldman$elm_css$Css$Structure$Output$mediaTypeToString = function (mediaType) {
	switch (mediaType.$) {
		case 'Print':
			return 'print';
		case 'Screen':
			return 'screen';
		default:
			return 'speech';
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString = function (mediaQuery) {
	var prefixWith = F3(
		function (str, mediaType, expressions) {
			return str + (' ' + A2(
				$elm$core$String$join,
				' and ',
				A2(
					$elm$core$List$cons,
					$rtfeldman$elm_css$Css$Structure$Output$mediaTypeToString(mediaType),
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString, expressions))));
		});
	switch (mediaQuery.$) {
		case 'AllQuery':
			var expressions = mediaQuery.a;
			return A2(
				$elm$core$String$join,
				' and ',
				A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString, expressions));
		case 'OnlyQuery':
			var mediaType = mediaQuery.a;
			var expressions = mediaQuery.b;
			return A3(prefixWith, 'only', mediaType, expressions);
		case 'NotQuery':
			var mediaType = mediaQuery.a;
			var expressions = mediaQuery.b;
			return A3(prefixWith, 'not', mediaType, expressions);
		default:
			var str = mediaQuery.a;
			return str;
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$importMediaQueryToString = F2(
	function (name, mediaQuery) {
		return '@import \"' + (name + ($rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString(mediaQuery) + '\"'));
	});
var $rtfeldman$elm_css$Css$Structure$Output$importToString = function (_v0) {
	var name = _v0.a;
	var mediaQueries = _v0.b;
	return A2(
		$elm$core$String$join,
		'\n',
		A2(
			$elm$core$List$map,
			$rtfeldman$elm_css$Css$Structure$Output$importMediaQueryToString(name),
			mediaQueries));
};
var $rtfeldman$elm_css$Css$Structure$Output$namespaceToString = function (_v0) {
	var prefix = _v0.a;
	var str = _v0.b;
	return '@namespace ' + (prefix + ('\"' + (str + '\"')));
};
var $rtfeldman$elm_css$Css$Structure$Output$spaceIndent = '    ';
var $rtfeldman$elm_css$Css$Structure$Output$indent = function (str) {
	return _Utils_ap($rtfeldman$elm_css$Css$Structure$Output$spaceIndent, str);
};
var $rtfeldman$elm_css$Css$Structure$Output$noIndent = '';
var $rtfeldman$elm_css$Css$Structure$Output$emitProperty = function (str) {
	return str + ';';
};
var $rtfeldman$elm_css$Css$Structure$Output$emitProperties = function (properties) {
	return A2(
		$elm$core$String$join,
		'\n',
		A2(
			$elm$core$List$map,
			A2($elm$core$Basics$composeL, $rtfeldman$elm_css$Css$Structure$Output$indent, $rtfeldman$elm_css$Css$Structure$Output$emitProperty),
			properties));
};
var $elm$core$String$append = _String_append;
var $rtfeldman$elm_css$Css$Structure$Output$pseudoElementToString = function (_v0) {
	var str = _v0.a;
	return '::' + str;
};
var $rtfeldman$elm_css$Css$Structure$Output$combinatorToString = function (combinator) {
	switch (combinator.$) {
		case 'AdjacentSibling':
			return '+';
		case 'GeneralSibling':
			return '~';
		case 'Child':
			return '>';
		default:
			return '';
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString = function (repeatableSimpleSelector) {
	switch (repeatableSimpleSelector.$) {
		case 'ClassSelector':
			var str = repeatableSimpleSelector.a;
			return '.' + str;
		case 'IdSelector':
			var str = repeatableSimpleSelector.a;
			return '#' + str;
		case 'PseudoClassSelector':
			var str = repeatableSimpleSelector.a;
			return ':' + str;
		default:
			var str = repeatableSimpleSelector.a;
			return '[' + (str + ']');
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString = function (simpleSelectorSequence) {
	switch (simpleSelectorSequence.$) {
		case 'TypeSelectorSequence':
			var str = simpleSelectorSequence.a.a;
			var repeatableSimpleSelectors = simpleSelectorSequence.b;
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$cons,
					str,
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors)));
		case 'UniversalSelectorSequence':
			var repeatableSimpleSelectors = simpleSelectorSequence.a;
			return $elm$core$List$isEmpty(repeatableSimpleSelectors) ? '*' : A2(
				$elm$core$String$join,
				'',
				A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors));
		default:
			var str = simpleSelectorSequence.a;
			var repeatableSimpleSelectors = simpleSelectorSequence.b;
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$cons,
					str,
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors)));
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$selectorChainToString = function (_v0) {
	var combinator = _v0.a;
	var sequence = _v0.b;
	return A2(
		$elm$core$String$join,
		' ',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$Structure$Output$combinatorToString(combinator),
				$rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString(sequence)
			]));
};
var $rtfeldman$elm_css$Css$Structure$Output$selectorToString = function (_v0) {
	var simpleSelectorSequence = _v0.a;
	var chain = _v0.b;
	var pseudoElement = _v0.c;
	var segments = A2(
		$elm$core$List$cons,
		$rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString(simpleSelectorSequence),
		A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$selectorChainToString, chain));
	var pseudoElementsString = A2(
		$elm$core$String$join,
		'',
		_List_fromArray(
			[
				A2(
				$elm$core$Maybe$withDefault,
				'',
				A2($elm$core$Maybe$map, $rtfeldman$elm_css$Css$Structure$Output$pseudoElementToString, pseudoElement))
			]));
	return A2(
		$elm$core$String$append,
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$filter,
				A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
				segments)),
		pseudoElementsString);
};
var $rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock = F2(
	function (indentLevel, _v0) {
		var firstSelector = _v0.a;
		var otherSelectors = _v0.b;
		var properties = _v0.c;
		var selectorStr = A2(
			$elm$core$String$join,
			', ',
			A2(
				$elm$core$List$map,
				$rtfeldman$elm_css$Css$Structure$Output$selectorToString,
				A2($elm$core$List$cons, firstSelector, otherSelectors)));
		return A2(
			$elm$core$String$join,
			'',
			_List_fromArray(
				[
					selectorStr,
					' {\n',
					indentLevel,
					$rtfeldman$elm_css$Css$Structure$Output$emitProperties(properties),
					'\n',
					indentLevel,
					'}'
				]));
	});
var $rtfeldman$elm_css$Css$Structure$Output$prettyPrintDeclaration = function (decl) {
	switch (decl.$) {
		case 'StyleBlockDeclaration':
			var styleBlock = decl.a;
			return A2($rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock, $rtfeldman$elm_css$Css$Structure$Output$noIndent, styleBlock);
		case 'MediaRule':
			var mediaQueries = decl.a;
			var styleBlocks = decl.b;
			var query = A2(
				$elm$core$String$join,
				',\n',
				A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString, mediaQueries));
			var blocks = A2(
				$elm$core$String$join,
				'\n\n',
				A2(
					$elm$core$List$map,
					A2(
						$elm$core$Basics$composeL,
						$rtfeldman$elm_css$Css$Structure$Output$indent,
						$rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock($rtfeldman$elm_css$Css$Structure$Output$spaceIndent)),
					styleBlocks));
			return '@media ' + (query + (' {\n' + (blocks + '\n}')));
		case 'SupportsRule':
			return 'TODO';
		case 'DocumentRule':
			return 'TODO';
		case 'PageRule':
			return 'TODO';
		case 'FontFace':
			return 'TODO';
		case 'Keyframes':
			var name = decl.a.name;
			var declaration = decl.a.declaration;
			return '@keyframes ' + (name + (' {\n' + (declaration + '\n}')));
		case 'Viewport':
			return 'TODO';
		case 'CounterStyle':
			return 'TODO';
		default:
			return 'TODO';
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$prettyPrint = function (_v0) {
	var charset = _v0.charset;
	var imports = _v0.imports;
	var namespaces = _v0.namespaces;
	var declarations = _v0.declarations;
	return A2(
		$elm$core$String$join,
		'\n\n',
		A2(
			$elm$core$List$filter,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$Output$charsetToString(charset),
					A2(
					$elm$core$String$join,
					'\n',
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$importToString, imports)),
					A2(
					$elm$core$String$join,
					'\n',
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$namespaceToString, namespaces)),
					A2(
					$elm$core$String$join,
					'\n\n',
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$prettyPrintDeclaration, declarations))
				])));
};
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $rtfeldman$elm_css$Css$Structure$CounterStyle = function (a) {
	return {$: 'CounterStyle', a: a};
};
var $rtfeldman$elm_css$Css$Structure$FontFace = function (a) {
	return {$: 'FontFace', a: a};
};
var $rtfeldman$elm_css$Css$Structure$PageRule = F2(
	function (a, b) {
		return {$: 'PageRule', a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$Selector = F3(
	function (a, b, c) {
		return {$: 'Selector', a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Structure$StyleBlock = F3(
	function (a, b, c) {
		return {$: 'StyleBlock', a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration = function (a) {
	return {$: 'StyleBlockDeclaration', a: a};
};
var $rtfeldman$elm_css$Css$Structure$SupportsRule = F2(
	function (a, b) {
		return {$: 'SupportsRule', a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$Viewport = function (a) {
	return {$: 'Viewport', a: a};
};
var $rtfeldman$elm_css$Css$Structure$MediaRule = F2(
	function (a, b) {
		return {$: 'MediaRule', a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$mapLast = F2(
	function (update, list) {
		if (!list.b) {
			return list;
		} else {
			if (!list.b.b) {
				var only = list.a;
				return _List_fromArray(
					[
						update(only)
					]);
			} else {
				var first = list.a;
				var rest = list.b;
				return A2(
					$elm$core$List$cons,
					first,
					A2($rtfeldman$elm_css$Css$Structure$mapLast, update, rest));
			}
		}
	});
var $rtfeldman$elm_css$Css$Structure$withPropertyAppended = F2(
	function (property, _v0) {
		var firstSelector = _v0.a;
		var otherSelectors = _v0.b;
		var properties = _v0.c;
		return A3(
			$rtfeldman$elm_css$Css$Structure$StyleBlock,
			firstSelector,
			otherSelectors,
			_Utils_ap(
				properties,
				_List_fromArray(
					[property])));
	});
var $rtfeldman$elm_css$Css$Structure$appendProperty = F2(
	function (property, declarations) {
		if (!declarations.b) {
			return declarations;
		} else {
			if (!declarations.b.b) {
				switch (declarations.a.$) {
					case 'StyleBlockDeclaration':
						var styleBlock = declarations.a.a;
						return _List_fromArray(
							[
								$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
								A2($rtfeldman$elm_css$Css$Structure$withPropertyAppended, property, styleBlock))
							]);
					case 'MediaRule':
						var _v1 = declarations.a;
						var mediaQueries = _v1.a;
						var styleBlocks = _v1.b;
						return _List_fromArray(
							[
								A2(
								$rtfeldman$elm_css$Css$Structure$MediaRule,
								mediaQueries,
								A2(
									$rtfeldman$elm_css$Css$Structure$mapLast,
									$rtfeldman$elm_css$Css$Structure$withPropertyAppended(property),
									styleBlocks))
							]);
					default:
						return declarations;
				}
			} else {
				var first = declarations.a;
				var rest = declarations.b;
				return A2(
					$elm$core$List$cons,
					first,
					A2($rtfeldman$elm_css$Css$Structure$appendProperty, property, rest));
			}
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendToLastSelector = F2(
	function (f, styleBlock) {
		if (!styleBlock.b.b) {
			var only = styleBlock.a;
			var properties = styleBlock.c;
			return _List_fromArray(
				[
					A3($rtfeldman$elm_css$Css$Structure$StyleBlock, only, _List_Nil, properties),
					A3(
					$rtfeldman$elm_css$Css$Structure$StyleBlock,
					f(only),
					_List_Nil,
					_List_Nil)
				]);
		} else {
			var first = styleBlock.a;
			var rest = styleBlock.b;
			var properties = styleBlock.c;
			var newRest = A2($elm$core$List$map, f, rest);
			var newFirst = f(first);
			return _List_fromArray(
				[
					A3($rtfeldman$elm_css$Css$Structure$StyleBlock, first, rest, properties),
					A3($rtfeldman$elm_css$Css$Structure$StyleBlock, newFirst, newRest, _List_Nil)
				]);
		}
	});
var $rtfeldman$elm_css$Css$Structure$applyPseudoElement = F2(
	function (pseudo, _v0) {
		var sequence = _v0.a;
		var selectors = _v0.b;
		return A3(
			$rtfeldman$elm_css$Css$Structure$Selector,
			sequence,
			selectors,
			$elm$core$Maybe$Just(pseudo));
	});
var $rtfeldman$elm_css$Css$Structure$appendPseudoElementToLastSelector = F2(
	function (pseudo, styleBlock) {
		return A2(
			$rtfeldman$elm_css$Css$Structure$appendToLastSelector,
			$rtfeldman$elm_css$Css$Structure$applyPseudoElement(pseudo),
			styleBlock);
	});
var $rtfeldman$elm_css$Css$Structure$CustomSelector = F2(
	function (a, b) {
		return {$: 'CustomSelector', a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$TypeSelectorSequence = F2(
	function (a, b) {
		return {$: 'TypeSelectorSequence', a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence = function (a) {
	return {$: 'UniversalSelectorSequence', a: a};
};
var $rtfeldman$elm_css$Css$Structure$appendRepeatable = F2(
	function (selector, sequence) {
		switch (sequence.$) {
			case 'TypeSelectorSequence':
				var typeSelector = sequence.a;
				var list = sequence.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$TypeSelectorSequence,
					typeSelector,
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
			case 'UniversalSelectorSequence':
				var list = sequence.a;
				return $rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
			default:
				var str = sequence.a;
				var list = sequence.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$CustomSelector,
					str,
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator = F2(
	function (selector, list) {
		if (!list.b) {
			return _List_Nil;
		} else {
			if (!list.b.b) {
				var _v1 = list.a;
				var combinator = _v1.a;
				var sequence = _v1.b;
				return _List_fromArray(
					[
						_Utils_Tuple2(
						combinator,
						A2($rtfeldman$elm_css$Css$Structure$appendRepeatable, selector, sequence))
					]);
			} else {
				var first = list.a;
				var rest = list.b;
				return A2(
					$elm$core$List$cons,
					first,
					A2($rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator, selector, rest));
			}
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendRepeatableSelector = F2(
	function (repeatableSimpleSelector, selector) {
		if (!selector.b.b) {
			var sequence = selector.a;
			var pseudoElement = selector.c;
			return A3(
				$rtfeldman$elm_css$Css$Structure$Selector,
				A2($rtfeldman$elm_css$Css$Structure$appendRepeatable, repeatableSimpleSelector, sequence),
				_List_Nil,
				pseudoElement);
		} else {
			var firstSelector = selector.a;
			var tuples = selector.b;
			var pseudoElement = selector.c;
			return A3(
				$rtfeldman$elm_css$Css$Structure$Selector,
				firstSelector,
				A2($rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator, repeatableSimpleSelector, tuples),
				pseudoElement);
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendRepeatableToLastSelector = F2(
	function (selector, styleBlock) {
		return A2(
			$rtfeldman$elm_css$Css$Structure$appendToLastSelector,
			$rtfeldman$elm_css$Css$Structure$appendRepeatableSelector(selector),
			styleBlock);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors = function (declarations) {
	collectSelectors:
	while (true) {
		if (!declarations.b) {
			return _List_Nil;
		} else {
			if (declarations.a.$ === 'StyleBlockDeclaration') {
				var _v1 = declarations.a.a;
				var firstSelector = _v1.a;
				var otherSelectors = _v1.b;
				var rest = declarations.b;
				return _Utils_ap(
					A2($elm$core$List$cons, firstSelector, otherSelectors),
					$rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(rest));
			} else {
				var rest = declarations.b;
				var $temp$declarations = rest;
				declarations = $temp$declarations;
				continue collectSelectors;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Structure$DocumentRule = F5(
	function (a, b, c, d, e) {
		return {$: 'DocumentRule', a: a, b: b, c: c, d: d, e: e};
	});
var $rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock = F2(
	function (update, declarations) {
		_v0$12:
		while (true) {
			if (!declarations.b) {
				return declarations;
			} else {
				if (!declarations.b.b) {
					switch (declarations.a.$) {
						case 'StyleBlockDeclaration':
							var styleBlock = declarations.a.a;
							return A2(
								$elm$core$List$map,
								$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration,
								update(styleBlock));
						case 'MediaRule':
							if (declarations.a.b.b) {
								if (!declarations.a.b.b.b) {
									var _v1 = declarations.a;
									var mediaQueries = _v1.a;
									var _v2 = _v1.b;
									var styleBlock = _v2.a;
									return _List_fromArray(
										[
											A2(
											$rtfeldman$elm_css$Css$Structure$MediaRule,
											mediaQueries,
											update(styleBlock))
										]);
								} else {
									var _v3 = declarations.a;
									var mediaQueries = _v3.a;
									var _v4 = _v3.b;
									var first = _v4.a;
									var rest = _v4.b;
									var _v5 = A2(
										$rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock,
										update,
										_List_fromArray(
											[
												A2($rtfeldman$elm_css$Css$Structure$MediaRule, mediaQueries, rest)
											]));
									if ((_v5.b && (_v5.a.$ === 'MediaRule')) && (!_v5.b.b)) {
										var _v6 = _v5.a;
										var newMediaQueries = _v6.a;
										var newStyleBlocks = _v6.b;
										return _List_fromArray(
											[
												A2(
												$rtfeldman$elm_css$Css$Structure$MediaRule,
												newMediaQueries,
												A2($elm$core$List$cons, first, newStyleBlocks))
											]);
									} else {
										var newDeclarations = _v5;
										return newDeclarations;
									}
								}
							} else {
								break _v0$12;
							}
						case 'SupportsRule':
							var _v7 = declarations.a;
							var str = _v7.a;
							var nestedDeclarations = _v7.b;
							return _List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Css$Structure$SupportsRule,
									str,
									A2($rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, update, nestedDeclarations))
								]);
						case 'DocumentRule':
							var _v8 = declarations.a;
							var str1 = _v8.a;
							var str2 = _v8.b;
							var str3 = _v8.c;
							var str4 = _v8.d;
							var styleBlock = _v8.e;
							return A2(
								$elm$core$List$map,
								A4($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4),
								update(styleBlock));
						case 'PageRule':
							var _v9 = declarations.a;
							return declarations;
						case 'FontFace':
							return declarations;
						case 'Keyframes':
							return declarations;
						case 'Viewport':
							return declarations;
						case 'CounterStyle':
							return declarations;
						default:
							return declarations;
					}
				} else {
					break _v0$12;
				}
			}
		}
		var first = declarations.a;
		var rest = declarations.b;
		return A2(
			$elm$core$List$cons,
			first,
			A2($rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, update, rest));
	});
var $elm$core$String$cons = _String_cons;
var $Skinney$murmur3$Murmur3$HashData = F4(
	function (shift, seed, hash, charsProcessed) {
		return {charsProcessed: charsProcessed, hash: hash, seed: seed, shift: shift};
	});
var $Skinney$murmur3$Murmur3$c1 = 3432918353;
var $Skinney$murmur3$Murmur3$c2 = 461845907;
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $Skinney$murmur3$Murmur3$multiplyBy = F2(
	function (b, a) {
		return ((a & 65535) * b) + ((((a >>> 16) * b) & 65535) << 16);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$Bitwise$or = _Bitwise_or;
var $Skinney$murmur3$Murmur3$rotlBy = F2(
	function (b, a) {
		return (a << b) | (a >>> (32 - b));
	});
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $Skinney$murmur3$Murmur3$finalize = function (data) {
	var acc = (!(!data.hash)) ? (data.seed ^ A2(
		$Skinney$murmur3$Murmur3$multiplyBy,
		$Skinney$murmur3$Murmur3$c2,
		A2(
			$Skinney$murmur3$Murmur3$rotlBy,
			15,
			A2($Skinney$murmur3$Murmur3$multiplyBy, $Skinney$murmur3$Murmur3$c1, data.hash)))) : data.seed;
	var h0 = acc ^ data.charsProcessed;
	var h1 = A2($Skinney$murmur3$Murmur3$multiplyBy, 2246822507, h0 ^ (h0 >>> 16));
	var h2 = A2($Skinney$murmur3$Murmur3$multiplyBy, 3266489909, h1 ^ (h1 >>> 13));
	return (h2 ^ (h2 >>> 16)) >>> 0;
};
var $elm$core$String$foldl = _String_foldl;
var $Skinney$murmur3$Murmur3$mix = F2(
	function (h1, k1) {
		return A2(
			$Skinney$murmur3$Murmur3$multiplyBy,
			5,
			A2(
				$Skinney$murmur3$Murmur3$rotlBy,
				13,
				h1 ^ A2(
					$Skinney$murmur3$Murmur3$multiplyBy,
					$Skinney$murmur3$Murmur3$c2,
					A2(
						$Skinney$murmur3$Murmur3$rotlBy,
						15,
						A2($Skinney$murmur3$Murmur3$multiplyBy, $Skinney$murmur3$Murmur3$c1, k1))))) + 3864292196;
	});
var $Skinney$murmur3$Murmur3$hashFold = F2(
	function (c, data) {
		var res = data.hash | ((255 & $elm$core$Char$toCode(c)) << data.shift);
		var _v0 = data.shift;
		if (_v0 === 24) {
			return {
				charsProcessed: data.charsProcessed + 1,
				hash: 0,
				seed: A2($Skinney$murmur3$Murmur3$mix, data.seed, res),
				shift: 0
			};
		} else {
			return {charsProcessed: data.charsProcessed + 1, hash: res, seed: data.seed, shift: data.shift + 8};
		}
	});
var $Skinney$murmur3$Murmur3$hashString = F2(
	function (seed, str) {
		return $Skinney$murmur3$Murmur3$finalize(
			A3(
				$elm$core$String$foldl,
				$Skinney$murmur3$Murmur3$hashFold,
				A4($Skinney$murmur3$Murmur3$HashData, 0, seed, 0, 0),
				str));
	});
var $rtfeldman$elm_css$Hash$murmurSeed = 15739;
var $elm$core$String$fromList = _String_fromList;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Basics$modBy = _Basics_modBy;
var $rtfeldman$elm_hex$Hex$unsafeToDigit = function (num) {
	unsafeToDigit:
	while (true) {
		switch (num) {
			case 0:
				return _Utils_chr('0');
			case 1:
				return _Utils_chr('1');
			case 2:
				return _Utils_chr('2');
			case 3:
				return _Utils_chr('3');
			case 4:
				return _Utils_chr('4');
			case 5:
				return _Utils_chr('5');
			case 6:
				return _Utils_chr('6');
			case 7:
				return _Utils_chr('7');
			case 8:
				return _Utils_chr('8');
			case 9:
				return _Utils_chr('9');
			case 10:
				return _Utils_chr('a');
			case 11:
				return _Utils_chr('b');
			case 12:
				return _Utils_chr('c');
			case 13:
				return _Utils_chr('d');
			case 14:
				return _Utils_chr('e');
			case 15:
				return _Utils_chr('f');
			default:
				var $temp$num = num;
				num = $temp$num;
				continue unsafeToDigit;
		}
	}
};
var $rtfeldman$elm_hex$Hex$unsafePositiveToDigits = F2(
	function (digits, num) {
		unsafePositiveToDigits:
		while (true) {
			if (num < 16) {
				return A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(num),
					digits);
			} else {
				var $temp$digits = A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(
						A2($elm$core$Basics$modBy, 16, num)),
					digits),
					$temp$num = (num / 16) | 0;
				digits = $temp$digits;
				num = $temp$num;
				continue unsafePositiveToDigits;
			}
		}
	});
var $rtfeldman$elm_hex$Hex$toString = function (num) {
	return $elm$core$String$fromList(
		(num < 0) ? A2(
			$elm$core$List$cons,
			_Utils_chr('-'),
			A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, -num)) : A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, num));
};
var $rtfeldman$elm_css$Hash$fromString = function (str) {
	return A2(
		$elm$core$String$cons,
		_Utils_chr('_'),
		$rtfeldman$elm_hex$Hex$toString(
			A2($Skinney$murmur3$Murmur3$hashString, $rtfeldman$elm_css$Hash$murmurSeed, str)));
};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$last = function (list) {
	last:
	while (true) {
		if (!list.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!list.b.b) {
				var singleton = list.a;
				return $elm$core$Maybe$Just(singleton);
			} else {
				var rest = list.b;
				var $temp$list = rest;
				list = $temp$list;
				continue last;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration = function (declarations) {
	lastDeclaration:
	while (true) {
		if (!declarations.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!declarations.b.b) {
				var x = declarations.a;
				return $elm$core$Maybe$Just(
					_List_fromArray(
						[x]));
			} else {
				var xs = declarations.b;
				var $temp$declarations = xs;
				declarations = $temp$declarations;
				continue lastDeclaration;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$oneOf = function (maybes) {
	oneOf:
	while (true) {
		if (!maybes.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var maybe = maybes.a;
			var rest = maybes.b;
			if (maybe.$ === 'Nothing') {
				var $temp$maybes = rest;
				maybes = $temp$maybes;
				continue oneOf;
			} else {
				return maybe;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Structure$FontFeatureValues = function (a) {
	return {$: 'FontFeatureValues', a: a};
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues = function (tuples) {
	var expandTuples = function (tuplesToExpand) {
		if (!tuplesToExpand.b) {
			return _List_Nil;
		} else {
			var properties = tuplesToExpand.a;
			var rest = tuplesToExpand.b;
			return A2(
				$elm$core$List$cons,
				properties,
				expandTuples(rest));
		}
	};
	var newTuples = expandTuples(tuples);
	return _List_fromArray(
		[
			$rtfeldman$elm_css$Css$Structure$FontFeatureValues(newTuples)
		]);
};
var $rtfeldman$elm_css$Css$Structure$styleBlockToMediaRule = F2(
	function (mediaQueries, declaration) {
		if (declaration.$ === 'StyleBlockDeclaration') {
			var styleBlock = declaration.a;
			return A2(
				$rtfeldman$elm_css$Css$Structure$MediaRule,
				mediaQueries,
				_List_fromArray(
					[styleBlock]));
		} else {
			return declaration;
		}
	});
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule = F5(
	function (str1, str2, str3, str4, declaration) {
		if (declaration.$ === 'StyleBlockDeclaration') {
			var structureStyleBlock = declaration.a;
			return A5($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4, structureStyleBlock);
		} else {
			return declaration;
		}
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule = F2(
	function (mediaQueries, declaration) {
		switch (declaration.$) {
			case 'StyleBlockDeclaration':
				var structureStyleBlock = declaration.a;
				return A2(
					$rtfeldman$elm_css$Css$Structure$MediaRule,
					mediaQueries,
					_List_fromArray(
						[structureStyleBlock]));
			case 'MediaRule':
				var newMediaQueries = declaration.a;
				var structureStyleBlocks = declaration.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$MediaRule,
					_Utils_ap(mediaQueries, newMediaQueries),
					structureStyleBlocks);
			case 'SupportsRule':
				var str = declaration.a;
				var declarations = declaration.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$SupportsRule,
					str,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule(mediaQueries),
						declarations));
			case 'DocumentRule':
				var str1 = declaration.a;
				var str2 = declaration.b;
				var str3 = declaration.c;
				var str4 = declaration.d;
				var structureStyleBlock = declaration.e;
				return A5($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4, structureStyleBlock);
			case 'PageRule':
				return declaration;
			case 'FontFace':
				return declaration;
			case 'Keyframes':
				return declaration;
			case 'Viewport':
				return declaration;
			case 'CounterStyle':
				return declaration;
			default:
				return declaration;
		}
	});
var $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet = function (_v0) {
	var declarations = _v0.a;
	return declarations;
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast = F4(
	function (nestedStyles, rest, f, declarations) {
		var withoutParent = function (decls) {
			return A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				$elm$core$List$tail(decls));
		};
		var nextResult = A2(
			$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
			rest,
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration(declarations)));
		var newDeclarations = function () {
			var _v14 = _Utils_Tuple2(
				$elm$core$List$head(nextResult),
				$rtfeldman$elm_css$Css$Preprocess$Resolve$last(declarations));
			if ((_v14.a.$ === 'Just') && (_v14.b.$ === 'Just')) {
				var nextResultParent = _v14.a.a;
				var originalParent = _v14.b.a;
				return _Utils_ap(
					A2(
						$elm$core$List$take,
						$elm$core$List$length(declarations) - 1,
						declarations),
					_List_fromArray(
						[
							(!_Utils_eq(originalParent, nextResultParent)) ? nextResultParent : originalParent
						]));
			} else {
				return declarations;
			}
		}();
		var insertStylesToNestedDecl = function (lastDecl) {
			return $elm$core$List$concat(
				A2(
					$rtfeldman$elm_css$Css$Structure$mapLast,
					$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles(nestedStyles),
					A2(
						$elm$core$List$map,
						$elm$core$List$singleton,
						A2($rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, f, lastDecl))));
		};
		var initialResult = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				insertStylesToNestedDecl,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration(declarations)));
		return _Utils_ap(
			newDeclarations,
			_Utils_ap(
				withoutParent(initialResult),
				withoutParent(nextResult)));
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles = F2(
	function (styles, declarations) {
		if (!styles.b) {
			return declarations;
		} else {
			switch (styles.a.$) {
				case 'AppendProperty':
					var property = styles.a.a;
					var rest = styles.b;
					return A2(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
						rest,
						A2($rtfeldman$elm_css$Css$Structure$appendProperty, property, declarations));
				case 'ExtendSelector':
					var _v4 = styles.a;
					var selector = _v4.a;
					var nestedStyles = _v4.b;
					var rest = styles.b;
					return A4(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast,
						nestedStyles,
						rest,
						$rtfeldman$elm_css$Css$Structure$appendRepeatableToLastSelector(selector),
						declarations);
				case 'NestSnippet':
					var _v5 = styles.a;
					var selectorCombinator = _v5.a;
					var snippets = _v5.b;
					var rest = styles.b;
					var chain = F2(
						function (_v9, _v10) {
							var originalSequence = _v9.a;
							var originalTuples = _v9.b;
							var originalPseudoElement = _v9.c;
							var newSequence = _v10.a;
							var newTuples = _v10.b;
							var newPseudoElement = _v10.c;
							return A3(
								$rtfeldman$elm_css$Css$Structure$Selector,
								originalSequence,
								_Utils_ap(
									originalTuples,
									A2(
										$elm$core$List$cons,
										_Utils_Tuple2(selectorCombinator, newSequence),
										newTuples)),
								$rtfeldman$elm_css$Css$Preprocess$Resolve$oneOf(
									_List_fromArray(
										[newPseudoElement, originalPseudoElement])));
						});
					var expandDeclaration = function (declaration) {
						switch (declaration.$) {
							case 'StyleBlockDeclaration':
								var _v7 = declaration.a;
								var firstSelector = _v7.a;
								var otherSelectors = _v7.b;
								var nestedStyles = _v7.c;
								var newSelectors = A2(
									$elm$core$List$concatMap,
									function (originalSelector) {
										return A2(
											$elm$core$List$map,
											chain(originalSelector),
											A2($elm$core$List$cons, firstSelector, otherSelectors));
									},
									$rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(declarations));
								var newDeclarations = function () {
									if (!newSelectors.b) {
										return _List_Nil;
									} else {
										var first = newSelectors.a;
										var remainder = newSelectors.b;
										return _List_fromArray(
											[
												$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
												A3($rtfeldman$elm_css$Css$Structure$StyleBlock, first, remainder, _List_Nil))
											]);
									}
								}();
								return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, nestedStyles, newDeclarations);
							case 'MediaRule':
								var mediaQueries = declaration.a;
								var styleBlocks = declaration.b;
								return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule, mediaQueries, styleBlocks);
							case 'SupportsRule':
								var str = declaration.a;
								var otherSnippets = declaration.b;
								return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule, str, otherSnippets);
							case 'DocumentRule':
								var str1 = declaration.a;
								var str2 = declaration.b;
								var str3 = declaration.c;
								var str4 = declaration.d;
								var styleBlock = declaration.e;
								return A2(
									$elm$core$List$map,
									A4($rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule, str1, str2, str3, str4),
									$rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
							case 'PageRule':
								var str = declaration.a;
								var properties = declaration.b;
								return _List_fromArray(
									[
										A2($rtfeldman$elm_css$Css$Structure$PageRule, str, properties)
									]);
							case 'FontFace':
								var properties = declaration.a;
								return _List_fromArray(
									[
										$rtfeldman$elm_css$Css$Structure$FontFace(properties)
									]);
							case 'Viewport':
								var properties = declaration.a;
								return _List_fromArray(
									[
										$rtfeldman$elm_css$Css$Structure$Viewport(properties)
									]);
							case 'CounterStyle':
								var properties = declaration.a;
								return _List_fromArray(
									[
										$rtfeldman$elm_css$Css$Structure$CounterStyle(properties)
									]);
							default:
								var tuples = declaration.a;
								return $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues(tuples);
						}
					};
					return $elm$core$List$concat(
						_Utils_ap(
							_List_fromArray(
								[
									A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, rest, declarations)
								]),
							A2(
								$elm$core$List$map,
								expandDeclaration,
								A2($elm$core$List$concatMap, $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets))));
				case 'WithPseudoElement':
					var _v11 = styles.a;
					var pseudoElement = _v11.a;
					var nestedStyles = _v11.b;
					var rest = styles.b;
					return A4(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast,
						nestedStyles,
						rest,
						$rtfeldman$elm_css$Css$Structure$appendPseudoElementToLastSelector(pseudoElement),
						declarations);
				case 'WithKeyframes':
					var str = styles.a.a;
					var rest = styles.b;
					var name = $rtfeldman$elm_css$Hash$fromString(str);
					var newProperty = 'animation-name:' + name;
					var newDeclarations = A2(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
						rest,
						A2($rtfeldman$elm_css$Css$Structure$appendProperty, newProperty, declarations));
					return A2(
						$elm$core$List$append,
						newDeclarations,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$Structure$Keyframes(
								{declaration: str, name: name})
							]));
				case 'WithMedia':
					var _v12 = styles.a;
					var mediaQueries = _v12.a;
					var nestedStyles = _v12.b;
					var rest = styles.b;
					var extraDeclarations = function () {
						var _v13 = $rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(declarations);
						if (!_v13.b) {
							return _List_Nil;
						} else {
							var firstSelector = _v13.a;
							var otherSelectors = _v13.b;
							return A2(
								$elm$core$List$map,
								$rtfeldman$elm_css$Css$Structure$styleBlockToMediaRule(mediaQueries),
								A2(
									$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
									nestedStyles,
									$elm$core$List$singleton(
										$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
											A3($rtfeldman$elm_css$Css$Structure$StyleBlock, firstSelector, otherSelectors, _List_Nil)))));
						}
					}();
					return _Utils_ap(
						A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, rest, declarations),
						extraDeclarations);
				default:
					var otherStyles = styles.a.a;
					var rest = styles.b;
					return A2(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
						_Utils_ap(otherStyles, rest),
						declarations);
			}
		}
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock = function (_v2) {
	var firstSelector = _v2.a;
	var otherSelectors = _v2.b;
	var styles = _v2.c;
	return A2(
		$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
		styles,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
				A3($rtfeldman$elm_css$Css$Structure$StyleBlock, firstSelector, otherSelectors, _List_Nil))
			]));
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$extract = function (snippetDeclarations) {
	if (!snippetDeclarations.b) {
		return _List_Nil;
	} else {
		var first = snippetDeclarations.a;
		var rest = snippetDeclarations.b;
		return _Utils_ap(
			$rtfeldman$elm_css$Css$Preprocess$Resolve$toDeclarations(first),
			$rtfeldman$elm_css$Css$Preprocess$Resolve$extract(rest));
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule = F2(
	function (mediaQueries, styleBlocks) {
		var handleStyleBlock = function (styleBlock) {
			return A2(
				$elm$core$List$map,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule(mediaQueries),
				$rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
		};
		return A2($elm$core$List$concatMap, handleStyleBlock, styleBlocks);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule = F2(
	function (str, snippets) {
		var declarations = $rtfeldman$elm_css$Css$Preprocess$Resolve$extract(
			A2($elm$core$List$concatMap, $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets));
		return _List_fromArray(
			[
				A2($rtfeldman$elm_css$Css$Structure$SupportsRule, str, declarations)
			]);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toDeclarations = function (snippetDeclaration) {
	switch (snippetDeclaration.$) {
		case 'StyleBlockDeclaration':
			var styleBlock = snippetDeclaration.a;
			return $rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock);
		case 'MediaRule':
			var mediaQueries = snippetDeclaration.a;
			var styleBlocks = snippetDeclaration.b;
			return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule, mediaQueries, styleBlocks);
		case 'SupportsRule':
			var str = snippetDeclaration.a;
			var snippets = snippetDeclaration.b;
			return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule, str, snippets);
		case 'DocumentRule':
			var str1 = snippetDeclaration.a;
			var str2 = snippetDeclaration.b;
			var str3 = snippetDeclaration.c;
			var str4 = snippetDeclaration.d;
			var styleBlock = snippetDeclaration.e;
			return A2(
				$elm$core$List$map,
				A4($rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule, str1, str2, str3, str4),
				$rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
		case 'PageRule':
			var str = snippetDeclaration.a;
			var properties = snippetDeclaration.b;
			return _List_fromArray(
				[
					A2($rtfeldman$elm_css$Css$Structure$PageRule, str, properties)
				]);
		case 'FontFace':
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$FontFace(properties)
				]);
		case 'Viewport':
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$Viewport(properties)
				]);
		case 'CounterStyle':
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$CounterStyle(properties)
				]);
		default:
			var tuples = snippetDeclaration.a;
			return $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues(tuples);
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toStructure = function (_v0) {
	var charset = _v0.charset;
	var imports = _v0.imports;
	var namespaces = _v0.namespaces;
	var snippets = _v0.snippets;
	var declarations = $rtfeldman$elm_css$Css$Preprocess$Resolve$extract(
		A2($elm$core$List$concatMap, $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets));
	return {charset: charset, declarations: declarations, imports: imports, namespaces: namespaces};
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$compileHelp = function (sheet) {
	return $rtfeldman$elm_css$Css$Structure$Output$prettyPrint(
		$rtfeldman$elm_css$Css$Structure$compactStylesheet(
			$rtfeldman$elm_css$Css$Preprocess$Resolve$toStructure(sheet)));
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$compile = function (styles) {
	return A2(
		$elm$core$String$join,
		'\n\n',
		A2($elm$core$List$map, $rtfeldman$elm_css$Css$Preprocess$Resolve$compileHelp, styles));
};
var $rtfeldman$elm_css$Css$Structure$ClassSelector = function (a) {
	return {$: 'ClassSelector', a: a};
};
var $rtfeldman$elm_css$Css$Preprocess$Snippet = function (a) {
	return {$: 'Snippet', a: a};
};
var $rtfeldman$elm_css$Css$Preprocess$StyleBlock = F3(
	function (a, b, c) {
		return {$: 'StyleBlock', a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Preprocess$StyleBlockDeclaration = function (a) {
	return {$: 'StyleBlockDeclaration', a: a};
};
var $rtfeldman$elm_css$VirtualDom$Styled$makeSnippet = F2(
	function (styles, sequence) {
		var selector = A3($rtfeldman$elm_css$Css$Structure$Selector, sequence, _List_Nil, $elm$core$Maybe$Nothing);
		return $rtfeldman$elm_css$Css$Preprocess$Snippet(
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$Preprocess$StyleBlockDeclaration(
					A3($rtfeldman$elm_css$Css$Preprocess$StyleBlock, selector, _List_Nil, styles))
				]));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$snippetFromPair = function (_v0) {
	var classname = _v0.a;
	var styles = _v0.b;
	return A2(
		$rtfeldman$elm_css$VirtualDom$Styled$makeSnippet,
		styles,
		$rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$ClassSelector(classname)
				])));
};
var $rtfeldman$elm_css$Css$Preprocess$stylesheet = function (snippets) {
	return {charset: $elm$core$Maybe$Nothing, imports: _List_Nil, namespaces: _List_Nil, snippets: snippets};
};
var $rtfeldman$elm_css$VirtualDom$Styled$toDeclaration = function (dict) {
	return $rtfeldman$elm_css$Css$Preprocess$Resolve$compile(
		$elm$core$List$singleton(
			$rtfeldman$elm_css$Css$Preprocess$stylesheet(
				A2(
					$elm$core$List$map,
					$rtfeldman$elm_css$VirtualDom$Styled$snippetFromPair,
					$elm$core$Dict$toList(dict)))));
};
var $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode = function (styles) {
	return A3(
		$elm$virtual_dom$VirtualDom$node,
		'style',
		_List_Nil,
		$elm$core$List$singleton(
			$elm$virtual_dom$VirtualDom$text(
				$rtfeldman$elm_css$VirtualDom$Styled$toDeclaration(styles))));
};
var $rtfeldman$elm_css$VirtualDom$Styled$unstyle = F3(
	function (elemType, properties, children) {
		var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			children);
		var childNodes = _v0.a;
		var styles = _v0.b;
		var styleNode = $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode(styles);
		return A3(
			$elm$virtual_dom$VirtualDom$node,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				styleNode,
				$elm$core$List$reverse(childNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$containsKey = F2(
	function (key, pairs) {
		containsKey:
		while (true) {
			if (!pairs.b) {
				return false;
			} else {
				var _v1 = pairs.a;
				var str = _v1.a;
				var rest = pairs.b;
				if (_Utils_eq(key, str)) {
					return true;
				} else {
					var $temp$key = key,
						$temp$pairs = rest;
					key = $temp$key;
					pairs = $temp$pairs;
					continue containsKey;
				}
			}
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$getUnusedKey = F2(
	function (_default, pairs) {
		getUnusedKey:
		while (true) {
			if (!pairs.b) {
				return _default;
			} else {
				var _v1 = pairs.a;
				var firstKey = _v1.a;
				var rest = pairs.b;
				var newKey = '_' + firstKey;
				if (A2($rtfeldman$elm_css$VirtualDom$Styled$containsKey, newKey, rest)) {
					var $temp$default = newKey,
						$temp$pairs = rest;
					_default = $temp$default;
					pairs = $temp$pairs;
					continue getUnusedKey;
				} else {
					return newKey;
				}
			}
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode = F2(
	function (allStyles, keyedChildNodes) {
		var styleNodeKey = A2($rtfeldman$elm_css$VirtualDom$Styled$getUnusedKey, '_', keyedChildNodes);
		var finalNode = $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode(allStyles);
		return _Utils_Tuple2(styleNodeKey, finalNode);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyed = F3(
	function (elemType, properties, keyedChildren) {
		var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			keyedChildren);
		var keyedChildNodes = _v0.a;
		var styles = _v0.b;
		var keyedStyleNode = A2($rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode, styles, keyedChildNodes);
		return A3(
			$elm$virtual_dom$VirtualDom$keyedNode,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				keyedStyleNode,
				$elm$core$List$reverse(keyedChildNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyedNS = F4(
	function (ns, elemType, properties, keyedChildren) {
		var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			keyedChildren);
		var keyedChildNodes = _v0.a;
		var styles = _v0.b;
		var keyedStyleNode = A2($rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode, styles, keyedChildNodes);
		return A4(
			$elm$virtual_dom$VirtualDom$keyedNodeNS,
			ns,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				keyedStyleNode,
				$elm$core$List$reverse(keyedChildNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$unstyleNS = F4(
	function (ns, elemType, properties, children) {
		var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			children);
		var childNodes = _v0.a;
		var styles = _v0.b;
		var styleNode = $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode(styles);
		return A4(
			$elm$virtual_dom$VirtualDom$nodeNS,
			ns,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				styleNode,
				$elm$core$List$reverse(childNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$toUnstyled = function (vdom) {
	switch (vdom.$) {
		case 'Unstyled':
			var plainNode = vdom.a;
			return plainNode;
		case 'Node':
			var elemType = vdom.a;
			var properties = vdom.b;
			var children = vdom.c;
			return A3($rtfeldman$elm_css$VirtualDom$Styled$unstyle, elemType, properties, children);
		case 'NodeNS':
			var ns = vdom.a;
			var elemType = vdom.b;
			var properties = vdom.c;
			var children = vdom.d;
			return A4($rtfeldman$elm_css$VirtualDom$Styled$unstyleNS, ns, elemType, properties, children);
		case 'KeyedNode':
			var elemType = vdom.a;
			var properties = vdom.b;
			var children = vdom.c;
			return A3($rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyed, elemType, properties, children);
		default:
			var ns = vdom.a;
			var elemType = vdom.b;
			var properties = vdom.c;
			var children = vdom.d;
			return A4($rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyedNS, ns, elemType, properties, children);
	}
};
var $rtfeldman$elm_css$Html$Styled$toUnstyled = $rtfeldman$elm_css$VirtualDom$Styled$toUnstyled;
var $author$project$Main$GotNewInspectorSize = function (a) {
	return {$: 'GotNewInspectorSize', a: a};
};
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2(
					$elm$core$Task$onError,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Err),
					A2(
						$elm$core$Task$andThen,
						A2(
							$elm$core$Basics$composeL,
							A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
							$elm$core$Result$Ok),
						task))));
	});
var $author$project$ResultExtra$const = F2(
	function (x, _v0) {
		return x;
	});
var $author$project$ResultExtra$convergeResult = F3(
	function (fa, fb, x) {
		if (x.$ === 'Err') {
			var a = x.a;
			return fa(a);
		} else {
			var b = x.a;
			return fb(b);
		}
	});
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$browser$Browser$Dom$getElement = _Browser_getElement;
var $author$project$MicroAgda$File$getFileName = function (_v0) {
	var n = _v0.a;
	return n;
};
var $author$project$Main$LoadFile = function (a) {
	return {$: 'LoadFile', a: a};
};
var $author$project$Main$loadFileTask = function (upf) {
	return A2(
		$elm$core$Task$perform,
		$elm$core$Basics$identity,
		$elm$core$Task$succeed(
			$author$project$Main$LoadFile(upf)));
};
var $elm$core$Debug$log = _Debug_log;
var $author$project$Main$model2hash = function (m) {
	var _v0 = m.file;
	if (_v0.$ === 'Just') {
		var fname = _v0.a;
		return m.fullScreenMode ? ($author$project$MicroAgda$File$getFileName(fname) + (',' + m.showName)) : $author$project$MicroAgda$File$getFileName(fname);
	} else {
		return '';
	}
};
var $author$project$MicroAgda$File$File = F2(
	function (a, b) {
		return {$: 'File', a: a, b: b};
	});
var $author$project$MicroAgda$Internal$Ctx$listToCtxFull = function (x) {
	return x;
};
var $author$project$MicroAgda$Internal$Ctx$emptyCtx = $author$project$MicroAgda$Internal$Ctx$listToCtxFull(_List_Nil);
var $elm$core$Result$andThen = F2(
	function (callback, result) {
		if (result.$ === 'Ok') {
			var value = result.a;
			return callback(value);
		} else {
			var msg = result.a;
			return $elm$core$Result$Err(msg);
		}
	});
var $author$project$MicroAgda$File$Definition = function (a) {
	return {$: 'Definition', a: a};
};
var $author$project$MicroAgda$File$defMap = F2(
	function (f, _v0) {
		var d = _v0.a;
		var _v1 = f(
			_Utils_Tuple3(
				_Utils_Tuple2(d.signature, d.body),
				d.args,
				d.data));
		var _v2 = _v1.a;
		var si = _v2.a;
		var bo = _v2.b;
		var al = _v1.b;
		var da = _v1.c;
		return $author$project$MicroAgda$File$Definition(
			{
				args: al,
				body: bo,
				data: da,
				name: d.name,
				signature: si,
				sub: A2(
					$elm$core$List$map,
					$author$project$MicroAgda$File$defMap(f),
					d.sub)
			});
	});
var $author$project$MicroAgda$Internal$Ctx$ctxToListFull = function (x) {
	return x;
};
var $author$project$MicroAgda$Internal$Ctx$define = F4(
	function (c, s, cty, tm) {
		return $author$project$MicroAgda$Internal$Ctx$listToCtxFull(
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					_Utils_Tuple2(s, cty),
					$elm$core$Maybe$Just(tm)),
				$author$project$MicroAgda$Internal$Ctx$ctxToListFull(c)));
	});
var $author$project$MicroAgda$File$getArgs = function (_v0) {
	var tcd = _v0.a;
	return tcd.args;
};
var $author$project$MicroAgda$File$getBodyTmInside = function (_v0) {
	var tcd = _v0.a;
	var _v1 = tcd.body;
	var tm = _v1.c;
	return tm;
};
var $author$project$MicroAgda$File$getData = function (_v0) {
	var tcd = _v0.a;
	return tcd.data;
};
var $author$project$MicroAgda$File$getContext = A2($elm$core$Basics$composeR, $author$project$MicroAgda$File$getData, $elm$core$Tuple$first);
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $author$project$MicroAgda$Internal$Term$BuildIn = function (a) {
	return {$: 'BuildIn', a: a};
};
var $author$project$MicroAgda$Internal$Term$Def = F2(
	function (a, b) {
		return {$: 'Def', a: a, b: b};
	});
var $author$project$MicroAgda$Internal$Term$FromContext = function (a) {
	return {$: 'FromContext', a: a};
};
var $author$project$MicroAgda$Internal$Term$Lam = F2(
	function (a, b) {
		return {$: 'Lam', a: a, b: b};
	});
var $author$project$MicroAgda$Internal$Term$LamP = F2(
	function (a, b) {
		return {$: 'LamP', a: a, b: b};
	});
var $author$project$MicroAgda$Internal$Term$Pi = F2(
	function (a, b) {
		return {$: 'Pi', a: a, b: b};
	});
var $author$project$MicroAgda$Internal$Term$Star = {$: 'Star'};
var $author$project$MicroAgda$Internal$Term$Var = F2(
	function (a, b) {
		return {$: 'Var', a: a, b: b};
	});
var $author$project$MicroAgda$Internal$Term$absMap = F2(
	function (f, x) {
		return {
			absName: x.absName,
			unAbs: f(x.unAbs)
		};
	});
var $author$project$MicroAgda$Internal$Term$domMap = F2(
	function (f, x) {
		return _Utils_update(
			x,
			{
				unDom: f(x.unDom)
			});
	});
var $author$project$MicroAgda$Internal$Term$Apply = function (a) {
	return {$: 'Apply', a: a};
};
var $author$project$MicroAgda$Internal$Term$IApply = F3(
	function (a, b, c) {
		return {$: 'IApply', a: a, b: b, c: c};
	});
var $author$project$MicroAgda$Internal$Term$argMap = F2(
	function (f, x) {
		return _Utils_update(
			x,
			{
				unArg: f(x.unArg)
			});
	});
var $author$project$MicroAgda$Internal$Term$elimMap = F2(
	function (f, y) {
		if (y.$ === 'Apply') {
			var a = y.a;
			return $author$project$MicroAgda$Internal$Term$Apply(
				A2($author$project$MicroAgda$Internal$Term$argMap, f, a));
		} else {
			var a0 = y.a;
			var a1 = y.b;
			var a = y.c;
			return A3(
				$author$project$MicroAgda$Internal$Term$IApply,
				f(a0),
				f(a1),
				f(a));
		}
	});
var $author$project$MicroAgda$Internal$Term$elimsMap = function (f) {
	return $elm$core$List$map(
		$author$project$MicroAgda$Internal$Term$elimMap(f));
};
var $author$project$MicroAgda$Internal$Term$partialCase = F2(
	function (sf, b) {
		return {body: b, subFace: sf};
	});
var $author$project$MicroAgda$Internal$Term$Hcomp = {$: 'Hcomp'};
var $author$project$MicroAgda$Internal$Term$I0 = {$: 'I0'};
var $author$project$MicroAgda$Internal$Term$I1 = {$: 'I1'};
var $author$project$MicroAgda$Internal$Term$IsOne = {$: 'IsOne'};
var $author$project$MicroAgda$Internal$Term$Max = {$: 'Max'};
var $author$project$MicroAgda$Internal$Term$Min = {$: 'Min'};
var $author$project$MicroAgda$Internal$Term$Neg = {$: 'Neg'};
var $author$project$MicroAgda$Internal$Term$OneIsOne = {$: 'OneIsOne'};
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (ra.$ === 'Ok') {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $author$project$MicroAgda$Internal$Term$absMapResult = F2(
	function (f, x) {
		return A2(
			$elm$core$Result$map,
			function (y) {
				return A2(
					$author$project$MicroAgda$Internal$Term$absMap,
					function (_v0) {
						return y;
					},
					x);
			},
			f(x.unAbs));
	});
var $author$project$MicroAgda$Internal$Term$buildIn = function (bin) {
	return A2(
		$author$project$MicroAgda$Internal$Term$Def,
		$author$project$MicroAgda$Internal$Term$BuildIn(bin),
		_List_Nil);
};
var $author$project$MicroAgda$Sort$Cgt = {$: 'Cgt'};
var $author$project$MicroAgda$Sort$Clt = {$: 'Clt'};
var $author$project$MicroAgda$Internal$Term$JT = function (a) {
	return {$: 'JT', a: a};
};
var $author$project$MicroAgda$Sort$compSwitch = function (c) {
	switch (c.$) {
		case 'Clt':
			return $author$project$MicroAgda$Sort$Cgt;
		case 'Cgt':
			return $author$project$MicroAgda$Sort$Clt;
		default:
			return c;
	}
};
var $author$project$MicroAgda$Sort$Ceq = {$: 'Ceq'};
var $author$project$MicroAgda$Sort$compareInts = F2(
	function (l, r) {
		return (_Utils_cmp(l, r) > 0) ? $author$project$MicroAgda$Sort$Cgt : ((_Utils_cmp(r, l) > 0) ? $author$project$MicroAgda$Sort$Clt : $author$project$MicroAgda$Sort$Ceq);
	});
var $author$project$MicroAgda$Internal$Term$isCompBIV = function (biv) {
	isCompBIV:
	while (true) {
		_v0$3:
		while (true) {
			switch (biv.$) {
				case 'JB1':
					if (biv.a.$ === 'Neg') {
						var _v1 = biv.a;
						var x = biv.b;
						var $temp$biv = x;
						biv = $temp$biv;
						continue isCompBIV;
					} else {
						break _v0$3;
					}
				case 'JT':
					switch (biv.a.$) {
						case 'Def':
							if ((biv.a.a.$ === 'FromContext') && (!biv.a.b.b)) {
								var _v2 = biv.a;
								var i = _v2.a.a;
								return true;
							} else {
								break _v0$3;
							}
						case 'Var':
							if (!biv.a.b.b) {
								var _v3 = biv.a;
								var i = _v3.a;
								return true;
							} else {
								break _v0$3;
							}
						default:
							break _v0$3;
					}
				default:
					break _v0$3;
			}
		}
		return false;
	}
};
var $author$project$MicroAgda$Internal$Term$compBIV = F2(
	function (l, r) {
		compBIV:
		while (true) {
			var _v0 = _Utils_Tuple2(
				$author$project$MicroAgda$Internal$Term$isCompBIV(l),
				$author$project$MicroAgda$Internal$Term$isCompBIV(r));
			if (_v0.a) {
				if (!_v0.b) {
					return $author$project$MicroAgda$Sort$Cgt;
				} else {
					var _v1 = _Utils_Tuple2(l, r);
					_v1$7:
					while (true) {
						switch (_v1.a.$) {
							case 'JB1':
								if (_v1.a.a.$ === 'Neg') {
									switch (_v1.b.$) {
										case 'JB1':
											if (_v1.b.a.$ === 'Neg') {
												var _v2 = _v1.a;
												var _v3 = _v2.a;
												var x = _v2.b;
												var _v4 = _v1.b;
												var _v5 = _v4.a;
												var y = _v4.b;
												var $temp$l = x,
													$temp$r = y;
												l = $temp$l;
												r = $temp$r;
												continue compBIV;
											} else {
												break _v1$7;
											}
										case 'JT':
											var _v6 = _v1.a;
											var _v7 = _v6.a;
											var x = _v6.b;
											var y = _v1.b.a;
											return $author$project$MicroAgda$Sort$compSwitch(
												A2($author$project$MicroAgda$Internal$Term$compBIV, r, l));
										default:
											break _v1$7;
									}
								} else {
									break _v1$7;
								}
							case 'JT':
								switch (_v1.b.$) {
									case 'JB1':
										if (_v1.b.a.$ === 'Neg') {
											var x = _v1.a.a;
											var _v8 = _v1.b;
											var _v9 = _v8.a;
											var y = _v8.b;
											var _v10 = A2(
												$author$project$MicroAgda$Internal$Term$compBIV,
												$author$project$MicroAgda$Internal$Term$JT(x),
												y);
											switch (_v10.$) {
												case 'Ceq':
													return $author$project$MicroAgda$Sort$Cgt;
												case 'Clt':
													return $author$project$MicroAgda$Sort$Clt;
												default:
													return $author$project$MicroAgda$Sort$Cgt;
											}
										} else {
											break _v1$7;
										}
									case 'JT':
										switch (_v1.a.a.$) {
											case 'Def':
												if ((_v1.a.a.a.$ === 'FromContext') && (!_v1.a.a.b.b)) {
													switch (_v1.b.a.$) {
														case 'Def':
															if ((_v1.b.a.a.$ === 'FromContext') && (!_v1.b.a.b.b)) {
																var _v11 = _v1.a.a;
																var i = _v11.a.a;
																var _v12 = _v1.b.a;
																var j = _v12.a.a;
																return A2($author$project$MicroAgda$Sort$compareInts, j, i);
															} else {
																break _v1$7;
															}
														case 'Var':
															if (!_v1.b.a.b.b) {
																var _v15 = _v1.a.a;
																var _v16 = _v1.b.a;
																return $author$project$MicroAgda$Sort$Cgt;
															} else {
																break _v1$7;
															}
														default:
															break _v1$7;
													}
												} else {
													break _v1$7;
												}
											case 'Var':
												if (!_v1.a.a.b.b) {
													switch (_v1.b.a.$) {
														case 'Var':
															if (!_v1.b.a.b.b) {
																var _v13 = _v1.a.a;
																var i = _v13.a;
																var _v14 = _v1.b.a;
																var j = _v14.a;
																return A2($author$project$MicroAgda$Sort$compareInts, i, j);
															} else {
																break _v1$7;
															}
														case 'Def':
															if ((_v1.b.a.a.$ === 'FromContext') && (!_v1.b.a.b.b)) {
																var _v17 = _v1.a.a;
																var _v18 = _v1.b.a;
																return $author$project$MicroAgda$Sort$Clt;
															} else {
																break _v1$7;
															}
														default:
															break _v1$7;
													}
												} else {
													break _v1$7;
												}
											default:
												break _v1$7;
										}
									default:
										break _v1$7;
								}
							default:
								break _v1$7;
						}
					}
					return $author$project$MicroAgda$Sort$Cgt;
				}
			} else {
				if (_v0.b) {
					return $author$project$MicroAgda$Sort$Clt;
				} else {
					return $author$project$MicroAgda$Sort$Cgt;
				}
			}
		}
	});
var $author$project$MicroAgda$Sort$compareBy = F4(
	function (f, ca, x, y) {
		return A2(
			ca,
			f(x),
			f(y));
	});
var $author$project$MicroAgda$Internal$Term$swapDom = F2(
	function (d, e) {
		return _Utils_update(
			d,
			{unDom: e});
	});
var $author$project$MicroAgda$Internal$Term$domMapResult = F2(
	function (f, x) {
		return A2(
			$elm$core$Result$map,
			function (y) {
				return A2($author$project$MicroAgda$Internal$Term$swapDom, x, y);
			},
			f(x.unDom));
	});
var $author$project$MicroAgda$Internal$ArgInfo$ArgInfo = function (a) {
	return {$: 'ArgInfo', a: a};
};
var $author$project$MicroAgda$Internal$ArgInfo$Visible = {$: 'Visible'};
var $author$project$MicroAgda$Internal$ArgInfo$default = $author$project$MicroAgda$Internal$ArgInfo$ArgInfo(
	{visibility: $author$project$MicroAgda$Internal$ArgInfo$Visible});
var $author$project$MicroAgda$Internal$Term$elim = function (a) {
	return $author$project$MicroAgda$Internal$Term$Apply(
		{argInfo: $author$project$MicroAgda$Internal$ArgInfo$default, unArg: a});
};
var $author$project$MicroAgda$Internal$Term$elimArg = function (e) {
	if (e.$ === 'Apply') {
		var a = e.a;
		return a.unArg;
	} else {
		var a = e.c;
		return a;
	}
};
var $author$project$ResultExtra$mapListResult = F2(
	function (f, la) {
		if (!la.b) {
			return $elm$core$Result$Ok(_List_Nil);
		} else {
			var x = la.a;
			var xs = la.b;
			var _v1 = f(x);
			if (_v1.$ === 'Err') {
				var e = _v1.a;
				return $elm$core$Result$Err(e);
			} else {
				var y = _v1.a;
				var _v2 = A2($author$project$ResultExtra$mapListResult, f, xs);
				if (_v2.$ === 'Err') {
					var ee = _v2.a;
					return $elm$core$Result$Err(ee);
				} else {
					var ys = _v2.a;
					return $elm$core$Result$Ok(
						A2($elm$core$List$cons, y, ys));
				}
			}
		}
	});
var $author$project$MicroAgda$Internal$Term$elimMapResult = F2(
	function (f, y) {
		if (y.$ === 'Apply') {
			var a = y.a;
			return A2(
				$elm$core$Result$map,
				$author$project$MicroAgda$Internal$Term$Apply,
				A2(
					$elm$core$Result$map,
					function (x) {
						return _Utils_update(
							a,
							{unArg: x});
					},
					f(a.unArg)));
		} else {
			var a0 = y.a;
			var a1 = y.b;
			var a = y.c;
			return A2(
				$elm$core$Result$andThen,
				function (x) {
					if (((x.b && x.b.b) && x.b.b.b) && (!x.b.b.b.b)) {
						var aa0 = x.a;
						var _v2 = x.b;
						var aa1 = _v2.a;
						var _v3 = _v2.b;
						var aa = _v3.a;
						return $elm$core$Result$Ok(
							A3($author$project$MicroAgda$Internal$Term$IApply, aa0, aa1, aa));
					} else {
						return $elm$core$Result$Err('Imposible!');
					}
				},
				A2(
					$author$project$ResultExtra$mapListResult,
					f,
					_List_fromArray(
						[a0, a1, a])));
		}
	});
var $author$project$MicroAgda$Internal$Term$fromBIView = function (bv) {
	switch (bv.$) {
		case 'JB':
			var bi = bv.a;
			return A2(
				$author$project$MicroAgda$Internal$Term$Def,
				$author$project$MicroAgda$Internal$Term$BuildIn(bi),
				_List_Nil);
		case 'JB1':
			var bi = bv.a;
			var biv = bv.b;
			return A2(
				$author$project$MicroAgda$Internal$Term$Def,
				$author$project$MicroAgda$Internal$Term$BuildIn(bi),
				_List_fromArray(
					[
						$author$project$MicroAgda$Internal$Term$elim(
						$author$project$MicroAgda$Internal$Term$fromBIView(biv))
					]));
		case 'JB2':
			var bi = bv.a;
			var biv1 = bv.b;
			var biv2 = bv.c;
			return A2(
				$author$project$MicroAgda$Internal$Term$Def,
				$author$project$MicroAgda$Internal$Term$BuildIn(bi),
				_List_fromArray(
					[
						$author$project$MicroAgda$Internal$Term$elim(
						$author$project$MicroAgda$Internal$Term$fromBIView(biv1)),
						$author$project$MicroAgda$Internal$Term$elim(
						$author$project$MicroAgda$Internal$Term$fromBIView(biv2))
					]));
		case 'JB4':
			var bi = bv.a;
			var biv1 = bv.b;
			var biv2 = bv.c;
			var biv3 = bv.d;
			var biv5 = bv.e;
			return A2(
				$author$project$MicroAgda$Internal$Term$Def,
				$author$project$MicroAgda$Internal$Term$BuildIn(bi),
				_List_fromArray(
					[
						$author$project$MicroAgda$Internal$Term$elim(
						$author$project$MicroAgda$Internal$Term$fromBIView(biv1)),
						$author$project$MicroAgda$Internal$Term$elim(
						$author$project$MicroAgda$Internal$Term$fromBIView(biv2)),
						$author$project$MicroAgda$Internal$Term$elim(
						$author$project$MicroAgda$Internal$Term$fromBIView(biv3)),
						$author$project$MicroAgda$Internal$Term$elim(
						$author$project$MicroAgda$Internal$Term$fromBIView(biv3))
					]));
		default:
			var tm = bv.a;
			return tm;
	}
};
var $author$project$MicroAgda$Internal$Term$getTail = function (tm) {
	switch (tm.$) {
		case 'LamP':
			var pcs = tm.a;
			var ee = tm.b;
			return ee;
		case 'Lam':
			var ai = tm.a;
			var b = tm.b;
			return _List_Nil;
		case 'Var':
			var i = tm.a;
			var ee = tm.b;
			return ee;
		case 'Def':
			if (tm.a.$ === 'FromContext') {
				var j = tm.a.a;
				var ee = tm.b;
				return ee;
			} else {
				var bi = tm.a.a;
				var ee = tm.b;
				return ee;
			}
		case 'Pi':
			return _List_Nil;
		default:
			return _List_Nil;
	}
};
var $author$project$MicroAgda$Internal$Term$minDepth = function (biv) {
	_v0$2:
	while (true) {
		switch (biv.$) {
			case 'JB':
				if (biv.a.$ === 'I1') {
					var _v1 = biv.a;
					return 0;
				} else {
					break _v0$2;
				}
			case 'JB2':
				if (biv.a.$ === 'Min') {
					var _v2 = biv.a;
					var y = biv.b;
					var z = biv.c;
					return 1 + $author$project$MicroAgda$Internal$Term$minDepth(z);
				} else {
					break _v0$2;
				}
			default:
				break _v0$2;
		}
	}
	return 1;
};
var $author$project$MicroAgda$Internal$Term$JB2 = F3(
	function (a, b, c) {
		return {$: 'JB2', a: a, b: b, c: c};
	});
var $author$project$MicroAgda$Internal$Term$minListLike = {
	cons: $author$project$MicroAgda$Internal$Term$JB2($author$project$MicroAgda$Internal$Term$Min),
	head: function (biv) {
		if ((biv.$ === 'JB2') && (biv.a.$ === 'Min')) {
			var _v1 = biv.a;
			var y = biv.b;
			var z = biv.c;
			return y;
		} else {
			var y = biv;
			return y;
		}
	},
	tail: function (biv) {
		if ((biv.$ === 'JB2') && (biv.a.$ === 'Min')) {
			var _v3 = biv.a;
			var y = biv.b;
			var z = biv.c;
			return $elm$core$Maybe$Just(z);
		} else {
			var y = biv;
			return $elm$core$Maybe$Nothing;
		}
	},
	trunk: function (x) {
		return x;
	}
};
var $author$project$MicroAgda$Sort$concatListlike = F2(
	function (ll, l) {
		return A2(
			$elm$core$Basics$composeR,
			ll.cons(
				ll.head(l)),
			A2(
				$elm$core$Maybe$withDefault,
				function (x) {
					return x;
				},
				A2(
					$elm$core$Maybe$map,
					$author$project$MicroAgda$Sort$concatListlike(ll),
					ll.tail(l))));
	});
var $author$project$MicroAgda$Sort$sortListlike = F3(
	function (cmp, ll, l) {
		var h = ll.head(l);
		var _v0 = ll.tail(l);
		if (_v0.$ === 'Nothing') {
			return l;
		} else {
			var tus = _v0.a;
			var t = A3($author$project$MicroAgda$Sort$sortListlike, cmp, ll, tus);
			var ht = ll.head(t);
			var _v1 = _Utils_Tuple2(
				ll.tail(t),
				A2(cmp, h, ht));
			switch (_v1.b.$) {
				case 'Ceq':
					var _v2 = _v1.b;
					return t;
				case 'Cgt':
					var _v3 = _v1.b;
					return A2(ll.cons, h, t);
				default:
					if (_v1.a.$ === 'Nothing') {
						var _v4 = _v1.a;
						var _v5 = _v1.b;
						return A2(
							ll.cons,
							ht,
							ll.trunk(h));
					} else {
						var tt = _v1.a.a;
						var _v6 = _v1.b;
						return A2(
							ll.cons,
							ht,
							A3(
								$author$project$MicroAgda$Sort$sortListlike,
								cmp,
								ll,
								A2(ll.cons, h, tt)));
					}
			}
		}
	});
var $author$project$MicroAgda$Internal$Term$minRed = F2(
	function (x, y) {
		var m = $author$project$MicroAgda$Internal$Term$minListLike;
		return A3(
			$author$project$MicroAgda$Sort$sortListlike,
			$author$project$MicroAgda$Internal$Term$compBIV,
			m,
			A3($author$project$MicroAgda$Sort$concatListlike, m, x, y));
	});
var $author$project$MicroAgda$Internal$Term$isNotUnder = F2(
	function (u, d) {
		var m = $author$project$MicroAgda$Internal$Term$minListLike;
		var _v0 = A4($author$project$MicroAgda$Sort$compareBy, $author$project$MicroAgda$Internal$Term$minDepth, $author$project$MicroAgda$Sort$compareInts, u, d);
		if (_v0.$ === 'Cgt') {
			return _Utils_cmp(
				$author$project$MicroAgda$Internal$Term$minDepth(
					A2($author$project$MicroAgda$Internal$Term$minRed, u, d)),
				$author$project$MicroAgda$Internal$Term$minDepth(u)) > 0;
		} else {
			return true;
		}
	});
var $author$project$MicroAgda$Sort$maybeSort = F3(
	function (c, l, r) {
		var _v0 = _Utils_Tuple2(l, r);
		if (_v0.a.$ === 'Nothing') {
			if (_v0.b.$ === 'Nothing') {
				var _v1 = _v0.a;
				var _v2 = _v0.b;
				return $author$project$MicroAgda$Sort$Ceq;
			} else {
				var _v4 = _v0.a;
				return $author$project$MicroAgda$Sort$Clt;
			}
		} else {
			if (_v0.b.$ === 'Nothing') {
				var _v3 = _v0.b;
				return $author$project$MicroAgda$Sort$Cgt;
			} else {
				var x = _v0.a.a;
				var y = _v0.b.a;
				return A2(c, x, y);
			}
		}
	});
var $author$project$MicroAgda$Sort$thenCompare = F4(
	function (c1, c2, l, r) {
		var _v0 = A2(c2, l, r);
		if (_v0.$ === 'Ceq') {
			return A2(c1, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $author$project$MicroAgda$Sort$lexiSort = F3(
	function (c, ll, x) {
		return A2(
			$author$project$MicroAgda$Sort$thenCompare,
			A2(
				$author$project$MicroAgda$Sort$compareBy,
				ll.tail,
				$author$project$MicroAgda$Sort$maybeSort(
					A2($author$project$MicroAgda$Sort$lexiSort, c, ll))),
			A2($author$project$MicroAgda$Sort$compareBy, ll.head, c))(x);
	});
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $author$project$MicroAgda$Internal$Term$liftTermIns = F3(
	function (b, f, x) {
		switch (x.$) {
			case 'LamP':
				var pcs = x.a;
				var ee = x.b;
				return A2(
					$author$project$MicroAgda$Internal$Term$LamP,
					A2(
						$elm$core$List$map,
						function (pc) {
							return {
								body: A3($author$project$MicroAgda$Internal$Term$liftTermIns, b, f, pc.body),
								subFace: A2(
									$elm$core$List$map,
									$elm$core$Tuple$mapFirst(
										A2($author$project$MicroAgda$Internal$Term$liftTermIns, b, f)),
									pc.subFace)
							};
						},
						pcs),
					A2(
						$author$project$MicroAgda$Internal$Term$elimsMap,
						A2($author$project$MicroAgda$Internal$Term$liftTermIns, b, f),
						ee));
			case 'Lam':
				var ai = x.a;
				var bb = x.b;
				return A2(
					$author$project$MicroAgda$Internal$Term$Lam,
					ai,
					A2(
						$author$project$MicroAgda$Internal$Term$absMap,
						A2($author$project$MicroAgda$Internal$Term$liftTermIns, b + 1, f),
						bb));
			case 'Var':
				var ii = x.a;
				var ee = x.b;
				var tail = A2(
					$author$project$MicroAgda$Internal$Term$elimsMap,
					A2($author$project$MicroAgda$Internal$Term$liftTermIns, b, f),
					ee);
				return (_Utils_cmp(ii, b) < 0) ? A2($author$project$MicroAgda$Internal$Term$Var, ii, tail) : A2(
					$author$project$MicroAgda$Internal$Term$Var,
					f(ii),
					tail);
			case 'Def':
				var n = x.a;
				var ee = x.b;
				return A2(
					$author$project$MicroAgda$Internal$Term$Def,
					n,
					A2(
						$author$project$MicroAgda$Internal$Term$elimsMap,
						A2($author$project$MicroAgda$Internal$Term$liftTermIns, b, f),
						ee));
			case 'Pi':
				var td = x.a;
				var tb = x.b;
				return A2(
					$author$project$MicroAgda$Internal$Term$Pi,
					A2(
						$author$project$MicroAgda$Internal$Term$domMap,
						A2($author$project$MicroAgda$Internal$Term$liftTermIns, b, f),
						td),
					A2(
						$author$project$MicroAgda$Internal$Term$absMap,
						A2($author$project$MicroAgda$Internal$Term$liftTermIns, b + 1, f),
						tb));
			default:
				return $author$project$MicroAgda$Internal$Term$Star;
		}
	});
var $author$project$MicroAgda$Internal$Term$liftTerm = F2(
	function (i, x) {
		return (!i) ? x : A3(
			$author$project$MicroAgda$Internal$Term$liftTermIns,
			0,
			function (y) {
				return i + y;
			},
			x);
	});
var $author$project$MicroAgda$Internal$Term$maxListLike = {
	cons: $author$project$MicroAgda$Internal$Term$JB2($author$project$MicroAgda$Internal$Term$Max),
	head: function (biv) {
		if ((biv.$ === 'JB2') && (biv.a.$ === 'Max')) {
			var _v1 = biv.a;
			var y = biv.b;
			var z = biv.c;
			return y;
		} else {
			var y = biv;
			return y;
		}
	},
	tail: function (biv) {
		if ((biv.$ === 'JB2') && (biv.a.$ === 'Max')) {
			var _v3 = biv.a;
			var y = biv.b;
			var z = biv.c;
			return $elm$core$Maybe$Just(z);
		} else {
			var y = biv;
			return $elm$core$Maybe$Nothing;
		}
	},
	trunk: function (x) {
		return x;
	}
};
var $author$project$MicroAgda$Sort$cons2FromMaybe = F3(
	function (ll, a, mb) {
		return A2(
			$elm$core$Maybe$withDefault,
			ll.trunk(a),
			A2(
				$elm$core$Maybe$map,
				ll.cons(a),
				mb));
	});
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$MicroAgda$Sort$list2filter = F3(
	function (ll, f, b) {
		var tm = A2(
			$elm$core$Maybe$andThen,
			A2($author$project$MicroAgda$Sort$list2filter, ll, f),
			ll.tail(b));
		return f(
			ll.head(b)) ? $elm$core$Maybe$Just(
			A3(
				$author$project$MicroAgda$Sort$cons2FromMaybe,
				ll,
				ll.head(b),
				tm)) : tm;
	});
var $author$project$MicroAgda$Internal$Term$pushMax = F2(
	function (h, t) {
		var m = $author$project$MicroAgda$Internal$Term$maxListLike;
		var ht = m.head(t);
		var c = A2(
			$author$project$MicroAgda$Sort$thenCompare,
			A2($author$project$MicroAgda$Sort$lexiSort, $author$project$MicroAgda$Internal$Term$compBIV, $author$project$MicroAgda$Internal$Term$minListLike),
			A2($author$project$MicroAgda$Sort$compareBy, $author$project$MicroAgda$Internal$Term$minDepth, $author$project$MicroAgda$Sort$compareInts));
		var _v0 = A2(c, h, ht);
		switch (_v0.$) {
			case 'Cgt':
				return A3(
					$author$project$MicroAgda$Sort$cons2FromMaybe,
					m,
					h,
					A3(
						$author$project$MicroAgda$Sort$list2filter,
						m,
						$author$project$MicroAgda$Internal$Term$isNotUnder(h),
						t));
			case 'Ceq':
				return t;
			default:
				return A2($author$project$MicroAgda$Internal$Term$isNotUnder, ht, h) ? A3(
					$elm$core$Basics$composeR,
					$elm$core$Maybe$withDefault(
						m.trunk(h)),
					m.cons(ht),
					A2(
						$elm$core$Maybe$map,
						$author$project$MicroAgda$Internal$Term$pushMax(h),
						m.tail(t))) : t;
		}
	});
var $author$project$MicroAgda$Internal$Term$maxRed = function (l) {
	var m = $author$project$MicroAgda$Internal$Term$maxListLike;
	return A2(
		$elm$core$Basics$composeR,
		$author$project$MicroAgda$Internal$Term$pushMax(
			m.head(l)),
		A2(
			$elm$core$Maybe$withDefault,
			function (x) {
				return x;
			},
			A2(
				$elm$core$Maybe$map,
				$author$project$MicroAgda$Internal$Term$maxRed,
				m.tail(l))));
};
var $author$project$MicroAgda$Internal$Term$mkIEnd = function (b) {
	return b ? $author$project$MicroAgda$Internal$Term$buildIn($author$project$MicroAgda$Internal$Term$I1) : $author$project$MicroAgda$Internal$Term$buildIn($author$project$MicroAgda$Internal$Term$I0);
};
var $author$project$MicroAgda$Internal$Term$mkPi = F2(
	function (domTm, boAbs) {
		return A2(
			$author$project$MicroAgda$Internal$Term$Pi,
			{domInfo: $author$project$MicroAgda$Internal$ArgInfo$default, domName: $elm$core$Maybe$Nothing, unDom: domTm},
			boAbs);
	});
var $author$project$MicroAgda$Internal$Term$notAbs = function (a) {
	return {absName: 'unnamed', unAbs: a};
};
var $author$project$MicroAgda$Internal$Term$isEmptyFaceIns = function (li) {
	isEmptyFaceIns:
	while (true) {
		_v0$3:
		while (true) {
			if (!li.b) {
				return false;
			} else {
				if (((((li.a.$ === 'JT') && li.b.b) && (li.b.a.$ === 'JB1')) && (li.b.a.a.$ === 'Neg')) && (li.b.a.b.$ === 'JT')) {
					switch (li.a.a.$) {
						case 'Def':
							if (((((li.a.a.a.$ === 'FromContext') && (!li.a.a.b.b)) && (li.b.a.b.a.$ === 'Def')) && (li.b.a.b.a.a.$ === 'FromContext')) && (!li.b.a.b.a.b.b)) {
								var _v1 = li.a.a;
								var i = _v1.a.a;
								var _v2 = li.b;
								var _v3 = _v2.a;
								var _v4 = _v3.a;
								var _v5 = _v3.b.a;
								var j = _v5.a.a;
								var xs = _v2.b;
								if (_Utils_eq(i, j)) {
									return true;
								} else {
									var $temp$li = xs;
									li = $temp$li;
									continue isEmptyFaceIns;
								}
							} else {
								break _v0$3;
							}
						case 'Var':
							if (((!li.a.a.b.b) && (li.b.a.b.a.$ === 'Var')) && (!li.b.a.b.a.b.b)) {
								var _v6 = li.a.a;
								var i = _v6.a;
								var _v7 = li.b;
								var _v8 = _v7.a;
								var _v9 = _v8.a;
								var _v10 = _v8.b.a;
								var j = _v10.a;
								var xs = _v7.b;
								if (_Utils_eq(i, j)) {
									return true;
								} else {
									var $temp$li = xs;
									li = $temp$li;
									continue isEmptyFaceIns;
								}
							} else {
								break _v0$3;
							}
						default:
							break _v0$3;
					}
				} else {
					break _v0$3;
				}
			}
		}
		var x = li.a;
		var xs = li.b;
		var $temp$li = xs;
		li = $temp$li;
		continue isEmptyFaceIns;
	}
};
var $author$project$MicroAgda$Sort$list2toList = F2(
	function (ll, b) {
		return A2(
			$elm$core$Maybe$withDefault,
			_List_fromArray(
				[
					ll.head(b)
				]),
			A2(
				$elm$core$Maybe$map,
				function (t) {
					return A2(
						$elm$core$List$cons,
						ll.head(b),
						A2($author$project$MicroAgda$Sort$list2toList, ll, t));
				},
				ll.tail(b)));
	});
var $author$project$MicroAgda$Internal$Term$JB = function (a) {
	return {$: 'JB', a: a};
};
var $author$project$MicroAgda$Internal$Term$JB1 = F2(
	function (a, b) {
		return {$: 'JB1', a: a, b: b};
	});
var $author$project$MicroAgda$Internal$Term$JB4 = F5(
	function (a, b, c, d, e) {
		return {$: 'JB4', a: a, b: b, c: c, d: d, e: e};
	});
var $author$project$MicroAgda$Internal$Term$toBIView = function (e) {
	var _v0 = $author$project$MicroAgda$Internal$Term$elimArg(e);
	_v0$4:
	while (true) {
		if ((_v0.$ === 'Def') && (_v0.a.$ === 'BuildIn')) {
			if (!_v0.b.b) {
				var bi = _v0.a.a;
				return $author$project$MicroAgda$Internal$Term$JB(bi);
			} else {
				if (!_v0.b.b.b) {
					var bi = _v0.a.a;
					var _v1 = _v0.b;
					var x = _v1.a;
					return A2(
						$author$project$MicroAgda$Internal$Term$JB1,
						bi,
						$author$project$MicroAgda$Internal$Term$toBIView(x));
				} else {
					if (!_v0.b.b.b.b) {
						var bi = _v0.a.a;
						var _v2 = _v0.b;
						var x = _v2.a;
						var _v3 = _v2.b;
						var y = _v3.a;
						return A3(
							$author$project$MicroAgda$Internal$Term$JB2,
							bi,
							$author$project$MicroAgda$Internal$Term$toBIView(x),
							$author$project$MicroAgda$Internal$Term$toBIView(y));
					} else {
						if (_v0.b.b.b.b.b && (!_v0.b.b.b.b.b.b)) {
							var bi = _v0.a.a;
							var _v4 = _v0.b;
							var x = _v4.a;
							var _v5 = _v4.b;
							var y = _v5.a;
							var _v6 = _v5.b;
							var z = _v6.a;
							var _v7 = _v6.b;
							var q = _v7.a;
							return A5(
								$author$project$MicroAgda$Internal$Term$JB4,
								bi,
								$author$project$MicroAgda$Internal$Term$toBIView(x),
								$author$project$MicroAgda$Internal$Term$toBIView(y),
								$author$project$MicroAgda$Internal$Term$toBIView(z),
								$author$project$MicroAgda$Internal$Term$toBIView(q));
						} else {
							break _v0$4;
						}
					}
				}
			}
		} else {
			break _v0$4;
		}
	}
	var t = _v0;
	return $author$project$MicroAgda$Internal$Term$JT(t);
};
var $author$project$MicroAgda$Internal$Term$isEmptyFace = function (t) {
	var _v0 = $author$project$MicroAgda$Internal$Term$toBIView(
		$author$project$MicroAgda$Internal$Term$elim(t));
	if ((_v0.$ === 'JB') && (_v0.a.$ === 'I0')) {
		var _v1 = _v0.a;
		return true;
	} else {
		var x = _v0;
		return $author$project$MicroAgda$Internal$Term$isEmptyFaceIns(
			A2($author$project$MicroAgda$Sort$list2toList, $author$project$MicroAgda$Internal$Term$minListLike, x));
	}
};
var $author$project$MicroAgda$Internal$Term$subFaceIns = function (t) {
	var _v0 = $author$project$MicroAgda$Internal$Term$toBIView(
		$author$project$MicroAgda$Internal$Term$elim(t));
	_v0$6:
	while (true) {
		switch (_v0.$) {
			case 'JB2':
				switch (_v0.a.$) {
					case 'Max':
						var _v1 = _v0.a;
						var h = _v0.b;
						var tl = _v0.c;
						return A2(
							$elm$core$List$append,
							$author$project$MicroAgda$Internal$Term$subFaceIns(
								$author$project$MicroAgda$Internal$Term$fromBIView(h)),
							$author$project$MicroAgda$Internal$Term$subFaceIns(
								$author$project$MicroAgda$Internal$Term$fromBIView(tl)));
					case 'Min':
						if ((_v0.b.$ === 'JB1') && (_v0.b.a.$ === 'Neg')) {
							var _v2 = _v0.a;
							var _v3 = _v0.b;
							var _v4 = _v3.a;
							var nt = _v3.b;
							var tl = _v0.c;
							return _List_fromArray(
								[
									A2(
									$elm$core$List$cons,
									_Utils_Tuple2(
										$author$project$MicroAgda$Internal$Term$fromBIView(nt),
										false),
									$elm$core$List$concat(
										$author$project$MicroAgda$Internal$Term$subFaceIns(
											$author$project$MicroAgda$Internal$Term$fromBIView(tl))))
								]);
						} else {
							var _v5 = _v0.a;
							var h = _v0.b;
							var tl = _v0.c;
							return _List_fromArray(
								[
									A2(
									$elm$core$List$cons,
									_Utils_Tuple2(
										$author$project$MicroAgda$Internal$Term$fromBIView(h),
										true),
									$elm$core$List$concat(
										$author$project$MicroAgda$Internal$Term$subFaceIns(
											$author$project$MicroAgda$Internal$Term$fromBIView(tl))))
								]);
						}
					default:
						break _v0$6;
				}
			case 'JB1':
				if (_v0.a.$ === 'Neg') {
					var _v6 = _v0.a;
					var nt = _v0.b;
					return _List_fromArray(
						[
							_List_fromArray(
							[
								_Utils_Tuple2(
								$author$project$MicroAgda$Internal$Term$fromBIView(nt),
								false)
							])
						]);
				} else {
					break _v0$6;
				}
			case 'JB':
				switch (_v0.a.$) {
					case 'I1':
						var _v7 = _v0.a;
						return _List_fromArray(
							[_List_Nil]);
					case 'I0':
						var _v8 = _v0.a;
						return _List_Nil;
					default:
						break _v0$6;
				}
			default:
				break _v0$6;
		}
	}
	return _List_fromArray(
		[
			_List_fromArray(
			[
				_Utils_Tuple2(t, true)
			])
		]);
};
var $author$project$MicroAgda$Internal$Term$subFace = function (t) {
	return $author$project$MicroAgda$Internal$Term$isEmptyFace(t) ? _List_Nil : $author$project$MicroAgda$Internal$Term$subFaceIns(t);
};
var $author$project$ResultExtra$thenPairResult = F2(
	function (f, rab) {
		if (rab.a.$ === 'Err') {
			var e = rab.a.a;
			return $elm$core$Result$Err(e);
		} else {
			if (rab.b.$ === 'Err') {
				var e = rab.b.a;
				return $elm$core$Result$Err(e);
			} else {
				var a = rab.a.a;
				var b = rab.b.a;
				return A2(f, a, b);
			}
		}
	});
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (result.$ === 'Ok') {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $author$project$MicroAgda$Internal$Term$absApply = F2(
	function (at, x) {
		return A2(
			$elm$core$Result$map,
			$author$project$MicroAgda$Internal$Term$liftTerm(-1),
			A3(
				$author$project$MicroAgda$Internal$Term$subst,
				0,
				A2($author$project$MicroAgda$Internal$Term$liftTerm, 1, x),
				at.unAbs));
	});
var $author$project$MicroAgda$Internal$Term$applySubFaceConstr = F2(
	function (sf, t0) {
		return A3(
			$elm$core$List$foldl,
			function (_v107) {
				var fc = _v107.a;
				var b = _v107.b;
				return $elm$core$Result$andThen(
					function (t) {
						var fi = $author$project$MicroAgda$Internal$Term$mkIEnd(b);
						_v108$2:
						while (true) {
							switch (fc.$) {
								case 'Var':
									if (!fc.b.b) {
										var i = fc.a;
										return $elm$core$Result$Ok(t);
									} else {
										break _v108$2;
									}
								case 'Def':
									if ((fc.a.$ === 'FromContext') && (!fc.b.b)) {
										var i = fc.a.a;
										return A3($author$project$MicroAgda$Internal$Term$substIC2, i, fi, t);
									} else {
										break _v108$2;
									}
								default:
									break _v108$2;
							}
						}
						return $elm$core$Result$Ok(t);
					});
			},
			$elm$core$Result$Ok(t0),
			sf);
	});
var $author$project$MicroAgda$Internal$Term$lamP = F2(
	function (x, y) {
		var _v103 = _Utils_Tuple2(x, y);
		if ((_v103.a.b && (!_v103.a.b.b)) && _v103.b.b) {
			var _v104 = _v103.a;
			var sf = _v104.a;
			var _v105 = _v103.b;
			var tl = _v105.b;
			var _v106 = sf.subFace;
			if (!_v106.b) {
				return A2($author$project$MicroAgda$Internal$Term$nfApp, sf.body, tl);
			} else {
				return $elm$core$Result$Ok(
					A2($author$project$MicroAgda$Internal$Term$LamP, x, y));
			}
		} else {
			return $elm$core$Result$Ok(
				A2($author$project$MicroAgda$Internal$Term$LamP, x, y));
		}
	});
var $author$project$MicroAgda$Internal$Term$mapPartialCasesRes = function (f) {
	return A2(
		$elm$core$Basics$composeR,
		$author$project$ResultExtra$mapListResult(
			function (pc) {
				return A2(
					$elm$core$Result$map,
					$elm$core$List$map(
						function (sf) {
							return A2(
								$elm$core$Result$map,
								$author$project$MicroAgda$Internal$Term$partialCase(sf),
								A2(
									$elm$core$Result$andThen,
									$author$project$MicroAgda$Internal$Term$applySubFaceConstr(sf),
									A2(f, sf, pc.body)));
						}),
					A2(
						$elm$core$Result$map,
						$author$project$MicroAgda$Internal$Term$subFace,
						A2(
							f,
							_List_Nil,
							$author$project$MicroAgda$Internal$Term$subFace2Term(pc.subFace))));
			}),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Result$map($elm$core$List$concat),
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Result$andThen(
					$author$project$ResultExtra$mapListResult($elm$core$Basics$identity)),
				$elm$core$Result$map(
					$author$project$MicroAgda$Internal$Term$cyclic$partialCases()))));
};
var $author$project$MicroAgda$Internal$Term$mkMin = F2(
	function (l, r) {
		return A2(
			$author$project$MicroAgda$Internal$Term$nfBI,
			$author$project$MicroAgda$Internal$Term$Min,
			_List_fromArray(
				[
					$author$project$MicroAgda$Internal$Term$elim(l),
					$author$project$MicroAgda$Internal$Term$elim(r)
				]));
	});
var $author$project$MicroAgda$Internal$Term$mkNeg = function (t) {
	return A2(
		$author$project$MicroAgda$Internal$Term$nfBI,
		$author$project$MicroAgda$Internal$Term$Neg,
		_List_fromArray(
			[
				$author$project$MicroAgda$Internal$Term$elim(t)
			]));
};
var $author$project$MicroAgda$Internal$Term$nfApp = F2(
	function (h, t) {
		return A2(
			$elm$core$Maybe$withDefault,
			function () {
				switch (h.$) {
					case 'LamP':
						var pcs = h.a;
						var ee = h.b;
						return A2(
							$author$project$MicroAgda$Internal$Term$lamP,
							pcs,
							A2($elm$core$List$append, ee, t));
					case 'Lam':
						var ai = h.a;
						var b = h.b;
						if (!t.b) {
							return $elm$core$Result$Ok(
								A2($author$project$MicroAgda$Internal$Term$Lam, ai, b));
						} else {
							var x = t.a;
							var xs = t.b;
							return A2(
								$elm$core$Result$andThen,
								function (y) {
									return A2($author$project$MicroAgda$Internal$Term$nfApp, y, xs);
								},
								A2(
									$author$project$MicroAgda$Internal$Term$absApply,
									b,
									$author$project$MicroAgda$Internal$Term$elimArg(x)));
						}
					case 'Var':
						var i = h.a;
						var ee = h.b;
						return $elm$core$Result$Ok(
							A2(
								$author$project$MicroAgda$Internal$Term$Var,
								i,
								A2($elm$core$List$append, ee, t)));
					case 'Def':
						if (h.a.$ === 'FromContext') {
							var j = h.a.a;
							var ee = h.b;
							return $elm$core$Result$Ok(
								A2(
									$author$project$MicroAgda$Internal$Term$Def,
									$author$project$MicroAgda$Internal$Term$FromContext(j),
									A2($elm$core$List$append, ee, t)));
						} else {
							var bi = h.a.a;
							var ee = h.b;
							return $elm$core$Result$Ok(
								A2(
									$author$project$MicroAgda$Internal$Term$nfBI,
									bi,
									A2($elm$core$List$append, ee, t)));
						}
					case 'Pi':
						return $elm$core$Result$Err('Pi in Head');
					default:
						return $elm$core$Result$Err('Star in Head');
				}
			}(),
			$author$project$MicroAgda$Internal$Term$pathAppElimInElims(t));
	});
var $author$project$MicroAgda$Internal$Term$nfBI = F2(
	function (bi, ee) {
		nfBI:
		while (true) {
			var _v12 = _Utils_Tuple2(
				bi,
				A2($elm$core$List$map, $author$project$MicroAgda$Internal$Term$toBIView, ee));
			_v12$7:
			while (true) {
				_v12$8:
				while (true) {
					_v12$9:
					while (true) {
						_v12$10:
						while (true) {
							_v12$11:
							while (true) {
								_v12$12:
								while (true) {
									_v12$13:
									while (true) {
										_v12$14:
										while (true) {
											_v12$17:
											while (true) {
												_v12$18:
												while (true) {
													_v12$19:
													while (true) {
														_v12$20:
														while (true) {
															_v12$21:
															while (true) {
																if (_v12.b.b) {
																	if (!_v12.b.b.b) {
																		switch (_v12.a.$) {
																			case 'Univ':
																				var _v13 = _v12.a;
																				var _v14 = _v12.b;
																				return $author$project$MicroAgda$Internal$Term$Star;
																			case 'Neg':
																				switch (_v12.b.a.$) {
																					case 'JB':
																						switch (_v12.b.a.a.$) {
																							case 'I0':
																								var _v35 = _v12.a;
																								var _v36 = _v12.b;
																								var _v37 = _v36.a.a;
																								return A2(
																									$author$project$MicroAgda$Internal$Term$Def,
																									$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$I1),
																									_List_Nil);
																							case 'I1':
																								var _v38 = _v12.a;
																								var _v39 = _v12.b;
																								var _v40 = _v39.a.a;
																								return A2(
																									$author$project$MicroAgda$Internal$Term$Def,
																									$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$I0),
																									_List_Nil);
																							default:
																								break _v12$21;
																						}
																					case 'JB1':
																						if (_v12.b.a.a.$ === 'Neg') {
																							var _v41 = _v12.a;
																							var _v42 = _v12.b;
																							var _v43 = _v42.a;
																							var _v44 = _v43.a;
																							var x = _v43.b;
																							return $author$project$MicroAgda$Internal$Term$fromBIView(x);
																						} else {
																							break _v12$21;
																						}
																					case 'JB2':
																						switch (_v12.b.a.a.$) {
																							case 'Max':
																								var _v77 = _v12.a;
																								var _v78 = _v12.b;
																								var _v79 = _v78.a;
																								var _v80 = _v79.a;
																								var x = _v79.b;
																								var y = _v79.c;
																								var $temp$bi = $author$project$MicroAgda$Internal$Term$Min,
																									$temp$ee = _List_fromArray(
																									[
																										$author$project$MicroAgda$Internal$Term$elim(
																										A2(
																											$author$project$MicroAgda$Internal$Term$nfBI,
																											$author$project$MicroAgda$Internal$Term$Neg,
																											_List_fromArray(
																												[
																													$author$project$MicroAgda$Internal$Term$elim(
																													$author$project$MicroAgda$Internal$Term$fromBIView(x))
																												]))),
																										$author$project$MicroAgda$Internal$Term$elim(
																										A2(
																											$author$project$MicroAgda$Internal$Term$nfBI,
																											$author$project$MicroAgda$Internal$Term$Neg,
																											_List_fromArray(
																												[
																													$author$project$MicroAgda$Internal$Term$elim(
																													$author$project$MicroAgda$Internal$Term$fromBIView(y))
																												])))
																									]);
																								bi = $temp$bi;
																								ee = $temp$ee;
																								continue nfBI;
																							case 'Min':
																								var _v81 = _v12.a;
																								var _v82 = _v12.b;
																								var _v83 = _v82.a;
																								var _v84 = _v83.a;
																								var x = _v83.b;
																								var y = _v83.c;
																								var $temp$bi = $author$project$MicroAgda$Internal$Term$Max,
																									$temp$ee = _List_fromArray(
																									[
																										$author$project$MicroAgda$Internal$Term$elim(
																										A2(
																											$author$project$MicroAgda$Internal$Term$nfBI,
																											$author$project$MicroAgda$Internal$Term$Neg,
																											_List_fromArray(
																												[
																													$author$project$MicroAgda$Internal$Term$elim(
																													$author$project$MicroAgda$Internal$Term$fromBIView(x))
																												]))),
																										$author$project$MicroAgda$Internal$Term$elim(
																										A2(
																											$author$project$MicroAgda$Internal$Term$nfBI,
																											$author$project$MicroAgda$Internal$Term$Neg,
																											_List_fromArray(
																												[
																													$author$project$MicroAgda$Internal$Term$elim(
																													$author$project$MicroAgda$Internal$Term$fromBIView(y))
																												])))
																									]);
																								bi = $temp$bi;
																								ee = $temp$ee;
																								continue nfBI;
																							default:
																								break _v12$21;
																						}
																					default:
																						break _v12$21;
																				}
																			default:
																				break _v12$21;
																		}
																	} else {
																		if (_v12.b.b.b.b) {
																			if (!_v12.b.b.b.b.b) {
																				if (_v12.a.$ === 'Partial') {
																					var _v15 = _v12.a;
																					var _v16 = _v12.b;
																					var _v17 = _v16.b;
																					var phi0 = _v17.a;
																					var _v18 = _v17.b;
																					var ty0 = _v18.a;
																					var phi = $author$project$MicroAgda$Internal$Term$fromBIView(phi0);
																					var ty = $author$project$MicroAgda$Internal$Term$fromBIView(ty0);
																					return A2(
																						$author$project$MicroAgda$Internal$Term$mkPi,
																						A2(
																							$author$project$MicroAgda$Internal$Term$Def,
																							$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$IsOne),
																							_List_fromArray(
																								[
																									$author$project$MicroAgda$Internal$Term$elim(phi)
																								])),
																						$author$project$MicroAgda$Internal$Term$notAbs(ty));
																				} else {
																					break _v12$21;
																				}
																			} else {
																				if (_v12.b.b.b.b.b.b && (!_v12.b.b.b.b.b.b.b)) {
																					switch (_v12.a.$) {
																						case 'Hcomp':
																							if ((((_v12.b.b.b.a.$ === 'JB') && (_v12.b.b.b.a.a.$ === 'I1')) && (_v12.b.b.b.b.a.$ === 'JT')) && (_v12.b.b.b.b.a.a.$ === 'Lam')) {
																								var _v19 = _v12.a;
																								var _v20 = _v12.b;
																								var _v21 = _v20.b;
																								var _v22 = _v21.b;
																								var _v23 = _v22.a.a;
																								var _v24 = _v22.b;
																								var _v25 = _v24.a.a;
																								var aa = _v25.a;
																								var bb = _v25.b;
																								var _v26 = _v24.b;
																								return A2(
																									$elm$core$Result$withDefault,
																									A2(
																										$author$project$MicroAgda$Internal$Term$Def,
																										$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$Hcomp),
																										ee),
																									A2(
																										$author$project$MicroAgda$Internal$Term$nfApp,
																										A2($author$project$MicroAgda$Internal$Term$Lam, aa, bb),
																										_List_fromArray(
																											[
																												$author$project$MicroAgda$Internal$Term$elim(
																												$author$project$MicroAgda$Internal$Term$buildIn($author$project$MicroAgda$Internal$Term$I1)),
																												$author$project$MicroAgda$Internal$Term$elim(
																												$author$project$MicroAgda$Internal$Term$buildIn($author$project$MicroAgda$Internal$Term$OneIsOne))
																											])));
																							} else {
																								break _v12$21;
																							}
																						case 'OutS':
																							if ((_v12.b.b.b.b.b.a.$ === 'JB4') && (_v12.b.b.b.b.b.a.a.$ === 'InS')) {
																								var _v27 = _v12.a;
																								var _v28 = _v12.b;
																								var _v29 = _v28.b;
																								var _v30 = _v29.b;
																								var _v31 = _v30.b;
																								var _v32 = _v31.b;
																								var _v33 = _v32.a;
																								var _v34 = _v33.a;
																								var y = _v33.e;
																								return $author$project$MicroAgda$Internal$Term$fromBIView(y);
																							} else {
																								break _v12$21;
																							}
																						default:
																							break _v12$21;
																					}
																				} else {
																					break _v12$21;
																				}
																			}
																		} else {
																			switch (_v12.a.$) {
																				case 'Min':
																					switch (_v12.b.a.$) {
																						case 'JB':
																							switch (_v12.b.b.a.$) {
																								case 'JB':
																									switch (_v12.b.a.a.$) {
																										case 'I0':
																											break _v12$7;
																										case 'I1':
																											switch (_v12.b.b.a.a.$) {
																												case 'I0':
																													break _v12$8;
																												case 'I1':
																													break _v12$13;
																												default:
																													break _v12$13;
																											}
																										default:
																											switch (_v12.b.b.a.a.$) {
																												case 'I0':
																													break _v12$8;
																												case 'I1':
																													break _v12$14;
																												default:
																													break _v12$19;
																											}
																									}
																								case 'JB2':
																									switch (_v12.b.a.a.$) {
																										case 'I0':
																											break _v12$7;
																										case 'I1':
																											break _v12$13;
																										default:
																											if (_v12.b.b.a.a.$ === 'Max') {
																												break _v12$18;
																											} else {
																												break _v12$19;
																											}
																									}
																								default:
																									switch (_v12.b.a.a.$) {
																										case 'I0':
																											break _v12$7;
																										case 'I1':
																											break _v12$13;
																										default:
																											break _v12$19;
																									}
																							}
																						case 'JB2':
																							switch (_v12.b.b.a.$) {
																								case 'JB':
																									switch (_v12.b.b.a.a.$) {
																										case 'I0':
																											break _v12$8;
																										case 'I1':
																											break _v12$14;
																										default:
																											if (_v12.b.a.a.$ === 'Max') {
																												break _v12$17;
																											} else {
																												break _v12$19;
																											}
																									}
																								case 'JB2':
																									if (_v12.b.a.a.$ === 'Max') {
																										break _v12$17;
																									} else {
																										if (_v12.b.b.a.a.$ === 'Max') {
																											break _v12$18;
																										} else {
																											break _v12$19;
																										}
																									}
																								default:
																									if (_v12.b.a.a.$ === 'Max') {
																										break _v12$17;
																									} else {
																										break _v12$19;
																									}
																							}
																						default:
																							switch (_v12.b.b.a.$) {
																								case 'JB':
																									switch (_v12.b.b.a.a.$) {
																										case 'I0':
																											break _v12$8;
																										case 'I1':
																											break _v12$14;
																										default:
																											break _v12$19;
																									}
																								case 'JB2':
																									if (_v12.b.b.a.a.$ === 'Max') {
																										break _v12$18;
																									} else {
																										break _v12$19;
																									}
																								default:
																									break _v12$19;
																							}
																					}
																				case 'Max':
																					if (_v12.b.a.$ === 'JB') {
																						if (_v12.b.b.a.$ === 'JB') {
																							switch (_v12.b.a.a.$) {
																								case 'I1':
																									break _v12$9;
																								case 'I0':
																									switch (_v12.b.b.a.a.$) {
																										case 'I1':
																											break _v12$10;
																										case 'I0':
																											break _v12$11;
																										default:
																											break _v12$11;
																									}
																								default:
																									switch (_v12.b.b.a.a.$) {
																										case 'I1':
																											break _v12$10;
																										case 'I0':
																											break _v12$12;
																										default:
																											break _v12$20;
																									}
																							}
																						} else {
																							switch (_v12.b.a.a.$) {
																								case 'I1':
																									break _v12$9;
																								case 'I0':
																									break _v12$11;
																								default:
																									break _v12$20;
																							}
																						}
																					} else {
																						if (_v12.b.b.a.$ === 'JB') {
																							switch (_v12.b.b.a.a.$) {
																								case 'I1':
																									break _v12$10;
																								case 'I0':
																									break _v12$12;
																								default:
																									break _v12$20;
																							}
																						} else {
																							break _v12$20;
																						}
																					}
																				default:
																					break _v12$21;
																			}
																		}
																	}
																} else {
																	break _v12$21;
																}
															}
															return A2(
																$author$project$MicroAgda$Internal$Term$Def,
																$author$project$MicroAgda$Internal$Term$BuildIn(bi),
																ee);
														}
														var _v98 = _v12.a;
														var _v99 = _v12.b;
														var x = _v99.a;
														var _v100 = _v99.b;
														var y = _v100.a;
														return $author$project$MicroAgda$Internal$Term$fromBIView(
															A2($author$project$MicroAgda$Internal$Term$maxRed, x, y));
													}
													var _v95 = _v12.a;
													var _v96 = _v12.b;
													var x = _v96.a;
													var _v97 = _v96.b;
													var y = _v97.a;
													return $author$project$MicroAgda$Internal$Term$fromBIView(
														A2($author$project$MicroAgda$Internal$Term$minRed, x, y));
												}
												var _v90 = _v12.a;
												var _v91 = _v12.b;
												var x = _v91.a;
												var _v92 = _v91.b;
												var _v93 = _v92.a;
												var _v94 = _v93.a;
												var y = _v93.b;
												var z = _v93.c;
												var $temp$bi = $author$project$MicroAgda$Internal$Term$Max,
													$temp$ee = _List_fromArray(
													[
														$author$project$MicroAgda$Internal$Term$elim(
														A2(
															$author$project$MicroAgda$Internal$Term$nfBI,
															$author$project$MicroAgda$Internal$Term$Min,
															_List_fromArray(
																[
																	$author$project$MicroAgda$Internal$Term$elim(
																	$author$project$MicroAgda$Internal$Term$fromBIView(x)),
																	$author$project$MicroAgda$Internal$Term$elim(
																	$author$project$MicroAgda$Internal$Term$fromBIView(y))
																]))),
														$author$project$MicroAgda$Internal$Term$elim(
														A2(
															$author$project$MicroAgda$Internal$Term$nfBI,
															$author$project$MicroAgda$Internal$Term$Min,
															_List_fromArray(
																[
																	$author$project$MicroAgda$Internal$Term$elim(
																	$author$project$MicroAgda$Internal$Term$fromBIView(x)),
																	$author$project$MicroAgda$Internal$Term$elim(
																	$author$project$MicroAgda$Internal$Term$fromBIView(z))
																])))
													]);
												bi = $temp$bi;
												ee = $temp$ee;
												continue nfBI;
											}
											var _v85 = _v12.a;
											var _v86 = _v12.b;
											var _v87 = _v86.a;
											var _v88 = _v87.a;
											var x = _v87.b;
											var y = _v87.c;
											var _v89 = _v86.b;
											var z = _v89.a;
											var $temp$bi = $author$project$MicroAgda$Internal$Term$Max,
												$temp$ee = _List_fromArray(
												[
													$author$project$MicroAgda$Internal$Term$elim(
													A2(
														$author$project$MicroAgda$Internal$Term$nfBI,
														$author$project$MicroAgda$Internal$Term$Min,
														_List_fromArray(
															[
																$author$project$MicroAgda$Internal$Term$elim(
																$author$project$MicroAgda$Internal$Term$fromBIView(x)),
																$author$project$MicroAgda$Internal$Term$elim(
																$author$project$MicroAgda$Internal$Term$fromBIView(z))
															]))),
													$author$project$MicroAgda$Internal$Term$elim(
													A2(
														$author$project$MicroAgda$Internal$Term$nfBI,
														$author$project$MicroAgda$Internal$Term$Min,
														_List_fromArray(
															[
																$author$project$MicroAgda$Internal$Term$elim(
																$author$project$MicroAgda$Internal$Term$fromBIView(y)),
																$author$project$MicroAgda$Internal$Term$elim(
																$author$project$MicroAgda$Internal$Term$fromBIView(z))
															])))
												]);
											bi = $temp$bi;
											ee = $temp$ee;
											continue nfBI;
										}
										var _v73 = _v12.a;
										var _v74 = _v12.b;
										var x = _v74.a;
										var _v75 = _v74.b;
										var _v76 = _v75.a.a;
										return $author$project$MicroAgda$Internal$Term$fromBIView(x);
									}
									var _v69 = _v12.a;
									var _v70 = _v12.b;
									var _v71 = _v70.a.a;
									var _v72 = _v70.b;
									var x = _v72.a;
									return $author$project$MicroAgda$Internal$Term$fromBIView(x);
								}
								var _v65 = _v12.a;
								var _v66 = _v12.b;
								var x = _v66.a;
								var _v67 = _v66.b;
								var _v68 = _v67.a.a;
								return $author$project$MicroAgda$Internal$Term$fromBIView(x);
							}
							var _v61 = _v12.a;
							var _v62 = _v12.b;
							var _v63 = _v62.a.a;
							var _v64 = _v62.b;
							var x = _v64.a;
							return $author$project$MicroAgda$Internal$Term$fromBIView(x);
						}
						var _v57 = _v12.a;
						var _v58 = _v12.b;
						var _v59 = _v58.b;
						var _v60 = _v59.a.a;
						return A2(
							$author$project$MicroAgda$Internal$Term$Def,
							$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$I1),
							_List_Nil);
					}
					var _v53 = _v12.a;
					var _v54 = _v12.b;
					var _v55 = _v54.a.a;
					var _v56 = _v54.b;
					return A2(
						$author$project$MicroAgda$Internal$Term$Def,
						$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$I1),
						_List_Nil);
				}
				var _v49 = _v12.a;
				var _v50 = _v12.b;
				var _v51 = _v50.b;
				var _v52 = _v51.a.a;
				return A2(
					$author$project$MicroAgda$Internal$Term$Def,
					$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$I0),
					_List_Nil);
			}
			var _v45 = _v12.a;
			var _v46 = _v12.b;
			var _v47 = _v46.a.a;
			var _v48 = _v46.b;
			return A2(
				$author$project$MicroAgda$Internal$Term$Def,
				$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$I0),
				_List_Nil);
		}
	});
var $author$project$MicroAgda$Internal$Term$pathAppElim = function (tm) {
	return A2(
		$elm$core$Maybe$withDefault,
		$elm$core$Result$Ok(tm),
		$author$project$MicroAgda$Internal$Term$pathAppElimInElims(
			$author$project$MicroAgda$Internal$Term$getTail(tm)));
};
var $author$project$MicroAgda$Internal$Term$pathAppElimInElims = function (es) {
	pathAppElimInElims:
	while (true) {
		if (es.b) {
			if ((((es.a.$ === 'IApply') && (es.a.c.$ === 'Def')) && (es.a.c.a.$ === 'BuildIn')) && (!es.a.c.b.b)) {
				var _v9 = es.a;
				var e0 = _v9.a;
				var e1 = _v9.b;
				var _v10 = _v9.c;
				var pe = _v10.a.a;
				var rest = es.b;
				switch (pe.$) {
					case 'I0':
						return $elm$core$Maybe$Just(
							A2($author$project$MicroAgda$Internal$Term$nfApp, e0, rest));
					case 'I1':
						return $elm$core$Maybe$Just(
							A2($author$project$MicroAgda$Internal$Term$nfApp, e1, rest));
					default:
						var $temp$es = rest;
						es = $temp$es;
						continue pathAppElimInElims;
				}
			} else {
				var rest = es.b;
				var $temp$es = rest;
				es = $temp$es;
				continue pathAppElimInElims;
			}
		} else {
			return $elm$core$Maybe$Nothing;
		}
	}
};
var $author$project$MicroAgda$Internal$Term$pushPartialCase = F2(
	function (x, l) {
		if (!l.b) {
			return _List_fromArray(
				[x]);
		} else {
			var h = l.a;
			var t = l.b;
			var ff = function (y) {
				return $author$project$MicroAgda$Internal$Term$toBIView(
					$author$project$MicroAgda$Internal$Term$elim(
						$author$project$MicroAgda$Internal$Term$subFace2Term(y.subFace)));
			};
			var hh = ff(h);
			var xx = ff(x);
			var c = A2(
				$author$project$MicroAgda$Sort$thenCompare,
				A2($author$project$MicroAgda$Sort$lexiSort, $author$project$MicroAgda$Internal$Term$compBIV, $author$project$MicroAgda$Internal$Term$minListLike),
				A2($author$project$MicroAgda$Sort$compareBy, $author$project$MicroAgda$Internal$Term$minDepth, $author$project$MicroAgda$Sort$compareInts));
			var _v7 = A2(c, xx, hh);
			switch (_v7.$) {
				case 'Ceq':
					return l;
				case 'Clt':
					return A2(
						$elm$core$List$cons,
						x,
						A2(
							$elm$core$List$filter,
							function (q) {
								return A2(
									$author$project$MicroAgda$Internal$Term$isNotUnder,
									ff(q),
									xx);
							},
							l));
				default:
					return A2($author$project$MicroAgda$Internal$Term$isNotUnder, xx, hh) ? A2(
						$elm$core$List$cons,
						h,
						A2($author$project$MicroAgda$Internal$Term$pushPartialCase, x, t)) : l;
			}
		}
	});
var $author$project$MicroAgda$Internal$Term$subFace2Term = function (sf) {
	if (!sf.b) {
		return $author$project$MicroAgda$Internal$Term$buildIn($author$project$MicroAgda$Internal$Term$I1);
	} else {
		var x = sf.a;
		var xs = sf.b;
		var f = function (_v5) {
			var t = _v5.a;
			var b = _v5.b;
			return b ? t : $author$project$MicroAgda$Internal$Term$mkNeg(t);
		};
		return A2(
			$author$project$MicroAgda$Internal$Term$mkMin,
			f(x),
			$author$project$MicroAgda$Internal$Term$subFace2Term(xs));
	}
};
var $author$project$MicroAgda$Internal$Term$subst = F3(
	function (i, x, e) {
		return A2(
			$elm$core$Result$andThen,
			$author$project$MicroAgda$Internal$Term$pathAppElim,
			function () {
				switch (e.$) {
					case 'LamP':
						var pcs = e.a;
						var ee = e.b;
						return A2(
							$author$project$ResultExtra$thenPairResult,
							function (pcsS) {
								return function (eeS) {
									return A2($author$project$MicroAgda$Internal$Term$lamP, pcsS, eeS);
								};
							},
							_Utils_Tuple2(
								A3($author$project$MicroAgda$Internal$Term$substPartialCases, i, x, pcs),
								A3($author$project$MicroAgda$Internal$Term$substElims, i, x, ee)));
					case 'Lam':
						var ai = e.a;
						var b = e.b;
						return A2(
							$elm$core$Result$map,
							$author$project$MicroAgda$Internal$Term$Lam(ai),
							A4($author$project$MicroAgda$Internal$Term$substAbs, i, x, ai, b));
					case 'Var':
						var ii = e.a;
						var ee = e.b;
						var tail = A3($author$project$MicroAgda$Internal$Term$substElims, i, x, ee);
						return _Utils_eq(ii, i) ? A2(
							$elm$core$Result$andThen,
							$author$project$MicroAgda$Internal$Term$nfApp(
								A2($author$project$MicroAgda$Internal$Term$liftTerm, i, x)),
							tail) : A2(
							$elm$core$Result$map,
							$author$project$MicroAgda$Internal$Term$Var(ii),
							tail);
					case 'Def':
						if (e.a.$ === 'FromContext') {
							var j = e.a.a;
							var ee = e.b;
							return A2(
								$elm$core$Result$map,
								$author$project$MicroAgda$Internal$Term$Def(
									$author$project$MicroAgda$Internal$Term$FromContext(j)),
								A3($author$project$MicroAgda$Internal$Term$substElims, i, x, ee));
						} else {
							var bi = e.a.a;
							var ee = e.b;
							return A2(
								$elm$core$Result$map,
								$author$project$MicroAgda$Internal$Term$nfBI(bi),
								A3($author$project$MicroAgda$Internal$Term$substElims, i, x, ee));
						}
					case 'Pi':
						var td = e.a;
						var tb = e.b;
						var _v3 = _Utils_Tuple2(
							A2(
								$author$project$MicroAgda$Internal$Term$domMapResult,
								A2($author$project$MicroAgda$Internal$Term$subst, i, x),
								td),
							A4($author$project$MicroAgda$Internal$Term$substAbs, i, x, td.domInfo, tb));
						if ((_v3.a.$ === 'Ok') && (_v3.b.$ === 'Ok')) {
							var tdd = _v3.a.a;
							var tbb = _v3.b.a;
							return $elm$core$Result$Ok(
								A2($author$project$MicroAgda$Internal$Term$Pi, tdd, tbb));
						} else {
							return $elm$core$Result$Err('Some err in subst - Pi');
						}
					default:
						return $elm$core$Result$Ok($author$project$MicroAgda$Internal$Term$Star);
				}
			}());
	});
var $author$project$MicroAgda$Internal$Term$substAbs = F4(
	function (i, x, ai, at) {
		return A2(
			$author$project$MicroAgda$Internal$Term$absMapResult,
			A2($author$project$MicroAgda$Internal$Term$subst, i + 1, x),
			at);
	});
var $author$project$MicroAgda$Internal$Term$substElims = F3(
	function (i, x, ee) {
		return A2(
			$author$project$ResultExtra$mapListResult,
			$author$project$MicroAgda$Internal$Term$elimMapResult(
				A2($author$project$MicroAgda$Internal$Term$subst, i, x)),
			ee);
	});
var $author$project$MicroAgda$Internal$Term$substElimsIC2 = F3(
	function (i, x, ee) {
		return A2(
			$author$project$ResultExtra$mapListResult,
			$author$project$MicroAgda$Internal$Term$elimMapResult(
				A2($author$project$MicroAgda$Internal$Term$substIC2, i, x)),
			ee);
	});
var $author$project$MicroAgda$Internal$Term$substIC2 = F3(
	function (i, x, e) {
		return A2(
			$elm$core$Result$andThen,
			$author$project$MicroAgda$Internal$Term$pathAppElim,
			function () {
				switch (e.$) {
					case 'LamP':
						var pcs = e.a;
						var ee = e.b;
						return A2(
							$author$project$ResultExtra$thenPairResult,
							function (pcsS) {
								return function (eeS) {
									return A2($author$project$MicroAgda$Internal$Term$lamP, pcsS, eeS);
								};
							},
							_Utils_Tuple2(
								A3($author$project$MicroAgda$Internal$Term$substPartialCasesIC2, i, x, pcs),
								A3($author$project$MicroAgda$Internal$Term$substElimsIC2, i, x, ee)));
					case 'Lam':
						var ai = e.a;
						var b = e.b;
						return A2(
							$elm$core$Result$map,
							$author$project$MicroAgda$Internal$Term$Lam(ai),
							A2(
								$author$project$MicroAgda$Internal$Term$absMapResult,
								A2($author$project$MicroAgda$Internal$Term$substIC2, i, x),
								b));
					case 'Var':
						var j = e.a;
						var ee = e.b;
						return A2(
							$elm$core$Result$map,
							$author$project$MicroAgda$Internal$Term$Var(j),
							A3($author$project$MicroAgda$Internal$Term$substElimsIC2, i, x, ee));
					case 'Def':
						if (e.a.$ === 'FromContext') {
							var ii = e.a.a;
							var ee = e.b;
							var tail = A3($author$project$MicroAgda$Internal$Term$substElimsIC2, i, x, ee);
							return _Utils_eq(ii, i) ? A2(
								$elm$core$Result$andThen,
								$author$project$MicroAgda$Internal$Term$nfApp(x),
								tail) : A2(
								$elm$core$Result$map,
								$author$project$MicroAgda$Internal$Term$Def(
									$author$project$MicroAgda$Internal$Term$FromContext(ii)),
								tail);
						} else {
							var bi = e.a.a;
							var ee = e.b;
							return A2(
								$elm$core$Result$map,
								$author$project$MicroAgda$Internal$Term$nfBI(bi),
								A3($author$project$MicroAgda$Internal$Term$substElimsIC2, i, x, ee));
						}
					case 'Pi':
						var td = e.a;
						var tb = e.b;
						var _v1 = _Utils_Tuple2(
							A2(
								$author$project$MicroAgda$Internal$Term$domMapResult,
								A2($author$project$MicroAgda$Internal$Term$substIC2, i, x),
								td),
							A2(
								$author$project$MicroAgda$Internal$Term$absMapResult,
								A2($author$project$MicroAgda$Internal$Term$substIC2, i, x),
								tb));
						if ((_v1.a.$ === 'Ok') && (_v1.b.$ === 'Ok')) {
							var tdd = _v1.a.a;
							var tbb = _v1.b.a;
							return $elm$core$Result$Ok(
								A2($author$project$MicroAgda$Internal$Term$Pi, tdd, tbb));
						} else {
							return $elm$core$Result$Err('Some err in subst - Pi');
						}
					default:
						return $elm$core$Result$Ok($author$project$MicroAgda$Internal$Term$Star);
				}
			}());
	});
var $author$project$MicroAgda$Internal$Term$substPartialCases = F2(
	function (i, x) {
		return $author$project$MicroAgda$Internal$Term$mapPartialCasesRes(
			function (sf) {
				return function (tm) {
					return A2(
						$elm$core$Result$andThen,
						function (x2) {
							return A3($author$project$MicroAgda$Internal$Term$subst, i, x2, tm);
						},
						A2($author$project$MicroAgda$Internal$Term$applySubFaceConstr, sf, x));
				};
			});
	});
var $author$project$MicroAgda$Internal$Term$substPartialCasesIC2 = F2(
	function (i, x) {
		return $author$project$MicroAgda$Internal$Term$mapPartialCasesRes(
			function (sf) {
				return function (tm) {
					return A2(
						$elm$core$Result$andThen,
						function (x2) {
							return A3($author$project$MicroAgda$Internal$Term$substIC2, i, x2, tm);
						},
						A2($author$project$MicroAgda$Internal$Term$applySubFaceConstr, sf, x));
				};
			});
	});
function $author$project$MicroAgda$Internal$Term$cyclic$partialCases() {
	return A2($elm$core$List$foldl, $author$project$MicroAgda$Internal$Term$pushPartialCase, _List_Nil);
}
try {
	var $author$project$MicroAgda$Internal$Term$partialCases = $author$project$MicroAgda$Internal$Term$cyclic$partialCases();
	$author$project$MicroAgda$Internal$Term$cyclic$partialCases = function () {
		return $author$project$MicroAgda$Internal$Term$partialCases;
	};
} catch ($) {
	throw 'Some top-level definitions from `MicroAgda.Internal.Term` are causing infinite recursion:\n\n  ┌─────┐\n  │    absApply\n  │     ↓\n  │    applySubFaceConstr\n  │     ↓\n  │    lamP\n  │     ↓\n  │    mapPartialCasesRes\n  │     ↓\n  │    mkMin\n  │     ↓\n  │    mkNeg\n  │     ↓\n  │    nfApp\n  │     ↓\n  │    nfBI\n  │     ↓\n  │    partialCases\n  │     ↓\n  │    pathAppElim\n  │     ↓\n  │    pathAppElimInElims\n  │     ↓\n  │    pushPartialCase\n  │     ↓\n  │    subFace2Term\n  │     ↓\n  │    subst\n  │     ↓\n  │    substAbs\n  │     ↓\n  │    substElims\n  │     ↓\n  │    substElimsIC2\n  │     ↓\n  │    substIC2\n  │     ↓\n  │    substPartialCases\n  │     ↓\n  │    substPartialCasesIC2\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $author$project$MicroAgda$Internal$Term$mapPartialCases = function (f) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$List$map(
			function (pc) {
				return A2(
					$elm$core$List$map,
					function (sf) {
						return A2(
							$author$project$MicroAgda$Internal$Term$partialCase,
							sf,
							f(pc.body));
					},
					$author$project$MicroAgda$Internal$Term$subFace(
						f(
							$author$project$MicroAgda$Internal$Term$subFace2Term(pc.subFace))));
			}),
		A2($elm$core$Basics$composeR, $elm$core$List$concat, $author$project$MicroAgda$Internal$Term$partialCases));
};
var $author$project$MicroAgda$Internal$Term$mkAbsSub = F3(
	function (cI, i, e) {
		switch (e.$) {
			case 'LamP':
				var pcs = e.a;
				var ee = e.b;
				return A2(
					$author$project$MicroAgda$Internal$Term$LamP,
					A2(
						$author$project$MicroAgda$Internal$Term$mapPartialCases,
						A2($author$project$MicroAgda$Internal$Term$mkAbsSub, cI, i),
						pcs),
					A2(
						$author$project$MicroAgda$Internal$Term$elimsMap,
						A2($author$project$MicroAgda$Internal$Term$mkAbsSub, cI, i),
						ee));
			case 'Lam':
				var ai = e.a;
				var b = e.b;
				return A2(
					$author$project$MicroAgda$Internal$Term$Lam,
					ai,
					A2(
						$author$project$MicroAgda$Internal$Term$absMap,
						A2($author$project$MicroAgda$Internal$Term$mkAbsSub, cI, i + 1),
						b));
			case 'Var':
				var ii = e.a;
				var ee = e.b;
				return A2(
					$author$project$MicroAgda$Internal$Term$Var,
					ii,
					A2(
						$author$project$MicroAgda$Internal$Term$elimsMap,
						A2($author$project$MicroAgda$Internal$Term$mkAbsSub, cI, i),
						ee));
			case 'Def':
				if (e.a.$ === 'FromContext') {
					var j = e.a.a;
					var ee = e.b;
					return _Utils_eq(j, cI) ? A2(
						$author$project$MicroAgda$Internal$Term$Var,
						i,
						A2(
							$author$project$MicroAgda$Internal$Term$elimsMap,
							A2($author$project$MicroAgda$Internal$Term$mkAbsSub, cI, i),
							ee)) : A2(
						$author$project$MicroAgda$Internal$Term$Def,
						$author$project$MicroAgda$Internal$Term$FromContext(j),
						A2(
							$author$project$MicroAgda$Internal$Term$elimsMap,
							A2($author$project$MicroAgda$Internal$Term$mkAbsSub, cI, i),
							ee));
				} else {
					var bi = e.a.a;
					var ee = e.b;
					return A2(
						$author$project$MicroAgda$Internal$Term$Def,
						$author$project$MicroAgda$Internal$Term$BuildIn(bi),
						A2(
							$author$project$MicroAgda$Internal$Term$elimsMap,
							A2($author$project$MicroAgda$Internal$Term$mkAbsSub, cI, i),
							ee));
				}
			case 'Pi':
				var td = e.a;
				var tb = e.b;
				return A2(
					$author$project$MicroAgda$Internal$Term$Pi,
					A2(
						$author$project$MicroAgda$Internal$Term$domMap,
						A2($author$project$MicroAgda$Internal$Term$mkAbsSub, cI, i),
						td),
					A2(
						$author$project$MicroAgda$Internal$Term$absMap,
						A2($author$project$MicroAgda$Internal$Term$mkAbsSub, cI, i + 1),
						tb));
			default:
				return $author$project$MicroAgda$Internal$Term$Star;
		}
	});
var $author$project$MicroAgda$Internal$Term$mkAbs = F3(
	function (s, i, t) {
		return {
			absName: s,
			unAbs: A3($author$project$MicroAgda$Internal$Term$mkAbsSub, i, 0, t)
		};
	});
var $author$project$MicroAgda$Internal$Term$mkLamUnsafe = function (boAbs) {
	return A2($author$project$MicroAgda$Internal$Term$Lam, $author$project$MicroAgda$Internal$ArgInfo$default, boAbs);
};
var $author$project$MicroAgda$Internal$Ctx$ctxToList = function (x) {
	return A2($elm$core$List$map, $elm$core$Tuple$first, x);
};
var $author$project$MicroAgda$Internal$Ctx$youngestSymbolId = A2(
	$elm$core$Basics$composeR,
	$author$project$MicroAgda$Internal$Ctx$ctxToList,
	A2(
		$elm$core$Basics$composeR,
		$elm$core$List$length,
		function (x) {
			return x - 1;
		}));
var $author$project$MicroAgda$TypeChecker$unTelescope = $elm$core$List$foldr(
	function (s) {
		return function (_v0) {
			var c = _v0.a;
			var tm = _v0.b;
			return _Utils_Tuple2(
				A2($elm$core$List$drop, 1, c),
				$author$project$MicroAgda$Internal$Term$mkLamUnsafe(
					A3(
						$author$project$MicroAgda$Internal$Term$mkAbs,
						s,
						$author$project$MicroAgda$Internal$Ctx$youngestSymbolId(c),
						tm)));
		};
	});
var $author$project$MicroAgda$File$getBodyTm = function (def) {
	return A2(
		$author$project$MicroAgda$TypeChecker$unTelescope,
		_Utils_Tuple2(
			$author$project$MicroAgda$File$getContext(def),
			$author$project$MicroAgda$File$getBodyTmInside(def)),
		$author$project$MicroAgda$File$getArgs(def)).b;
};
var $author$project$MicroAgda$File$getName = function (_v0) {
	var tcd = _v0.a;
	return tcd.name;
};
var $author$project$MicroAgda$Internal$Ctx$CT = function (a) {
	return {$: 'CT', a: a};
};
var $author$project$MicroAgda$File$getSignatureCT = function (_v0) {
	var tcd = _v0.a;
	var _v1 = tcd.signature;
	var tm = _v1.c;
	return $author$project$MicroAgda$Internal$Ctx$CT(tm);
};
var $author$project$MicroAgda$File$defineByDef = F2(
	function (tcd, c) {
		return A4(
			$author$project$MicroAgda$Internal$Ctx$define,
			c,
			$author$project$MicroAgda$File$getName(tcd),
			$author$project$MicroAgda$File$getSignatureCT(tcd),
			$author$project$MicroAgda$File$getBodyTm(tcd));
	});
var $author$project$ResultExtra$extractOptionalResult = A2(
	$author$project$ResultExtra$convergeResult,
	function (a) {
		return _Utils_Tuple2(a, $elm$core$Maybe$Nothing);
	},
	function (_v0) {
		var a = _v0.a;
		var b = _v0.b;
		return _Utils_Tuple2(
			a,
			$elm$core$Maybe$Just(b));
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (result.$ === 'Ok') {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $author$project$ResultExtra$mapFoldSafe = F5(
	function (f1, f1fail, f2, f3, v0) {
		var foldF = function (a) {
			return A2(
				$elm$core$Basics$composeR,
				$elm$core$Result$mapError(
					function (e) {
						return A2(
							$elm$core$List$cons,
							f1fail(a),
							e);
					}),
				$elm$core$Result$andThen(
					function (_v0) {
						var v = _v0.a;
						var lsc = _v0.b;
						return A2(
							$elm$core$Result$mapError,
							function (bs) {
								return A2(
									$elm$core$List$cons,
									bs,
									A2($elm$core$List$map, f2, lsc));
							},
							A2(
								$elm$core$Result$map,
								function (newC) {
									return _Utils_Tuple2(
										A2(f3, newC, v),
										A2($elm$core$List$cons, newC, lsc));
								},
								A2(f1, v, a)));
					}));
		};
		return A2(
			$elm$core$Basics$composeR,
			A2(
				$elm$core$List$foldl,
				foldF,
				$elm$core$Result$Ok(
					_Utils_Tuple2(v0, _List_Nil))),
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Result$map(
					$elm$core$Tuple$mapSecond($elm$core$List$reverse)),
				$elm$core$Result$mapError($elm$core$List$reverse)));
	});
var $author$project$MicroAgda$File$defMapSafe = F2(
	function (f, _v0) {
		var d = _v0.a;
		var _v1 = f(
			_Utils_Tuple3(
				_Utils_Tuple2(d.signature, d.body),
				d.args,
				d.data));
		if (_v1.$ === 'Just') {
			var _v2 = _v1.a;
			var _v3 = _v2.a;
			var si = _v3.a;
			var bo = _v3.b;
			var al = _v2.b;
			var da = _v2.c;
			return A2(
				$elm$core$Result$mapError,
				function (_v4) {
					return $author$project$MicroAgda$File$Definition(d);
				},
				A2(
					$elm$core$Result$map,
					function (lii) {
						return $author$project$MicroAgda$File$Definition(
							{args: al, body: bo, data: da, name: d.name, signature: si, sub: lii});
					},
					A2(
						$author$project$ResultExtra$mapListResult,
						$author$project$MicroAgda$File$defMapSafe(f),
						d.sub)));
		} else {
			return $elm$core$Result$Err(
				$author$project$MicroAgda$File$Definition(d));
		}
	});
var $elm$parser$Parser$ExpectingEnd = {$: 'ExpectingEnd'};
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 'Bad', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 'Good', a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Parser = function (a) {
	return {$: 'Parser', a: a};
};
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 'AddRight', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {col: col, contextStack: contextStack, problem: problem, row: row};
	});
var $elm$parser$Parser$Advanced$Empty = {$: 'Empty'};
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.row, s.col, x, s.context));
	});
var $elm$parser$Parser$Advanced$end = function (x) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return _Utils_eq(
				$elm$core$String$length(s.src),
				s.offset) ? A3($elm$parser$Parser$Advanced$Good, false, _Utils_Tuple0, s) : A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, x));
		});
};
var $elm$parser$Parser$end = $elm$parser$Parser$Advanced$end($elm$parser$Parser$ExpectingEnd);
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0.a;
		var parseB = _v1.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v2 = parseA(s0);
				if (_v2.$ === 'Bad') {
					var p = _v2.a;
					var x = _v2.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p1 = _v2.a;
					var a = _v2.b;
					var s1 = _v2.c;
					var _v3 = parseB(s1);
					if (_v3.$ === 'Bad') {
						var p2 = _v3.a;
						var x = _v3.b;
						return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
					} else {
						var p2 = _v3.a;
						var b = _v3.b;
						var s2 = _v3.c;
						return A3(
							$elm$parser$Parser$Advanced$Good,
							p1 || p2,
							A2(func, a, b),
							s2);
					}
				}
			});
	});
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $elm$parser$Parser$ignorer = $elm$parser$Parser$Advanced$ignorer;
var $elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
	});
var $elm$parser$Parser$keeper = $elm$parser$Parser$Advanced$keeper;
var $elm$parser$Parser$Forbidden = {$: 'Forbidden'};
var $author$project$MicroAgda$Raw$Lam = F2(
	function (a, b) {
		return {$: 'Lam', a: a, b: b};
	});
var $author$project$MicroAgda$Raw$LamP = function (a) {
	return {$: 'LamP', a: a};
};
var $elm$parser$Parser$Optional = {$: 'Optional'};
var $author$project$MicroAgda$Raw$Pi = F3(
	function (a, b, c) {
		return {$: 'Pi', a: a, b: b, c: c};
	});
var $elm$core$Set$Set_elm_builtin = function (a) {
	return {$: 'Set_elm_builtin', a: a};
};
var $elm$core$Set$empty = $elm$core$Set$Set_elm_builtin($elm$core$Dict$empty);
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return $elm$core$Set$Set_elm_builtin(
			A3($elm$core$Dict$insert, key, _Utils_Tuple0, dict));
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$MicroAgda$Raw$isAgdaNameChar = function (c) {
	return $elm$core$Char$isAlphaNum(c) || A2(
		$elm$core$List$member,
		c,
		_List_fromArray(
			[
				_Utils_chr('ℓ'),
				_Utils_chr('φ'),
				_Utils_chr('~'),
				_Utils_chr('-'),
				_Utils_chr('='),
				_Utils_chr(':'),
				_Utils_chr('\''),
				_Utils_chr('α'),
				_Utils_chr('β')
			]));
};
var $elm$parser$Parser$ExpectingVariable = {$: 'ExpectingVariable'};
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (_v0.$ === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return A2($elm$core$Dict$member, key, dict);
	});
var $elm$parser$Parser$Advanced$varHelp = F7(
	function (isGood, offset, row, col, src, indent, context) {
		varHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, src);
			if (_Utils_eq(newOffset, -1)) {
				return {col: col, context: context, indent: indent, offset: offset, row: row, src: src};
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$src = src,
						$temp$indent = indent,
						$temp$context = context;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					src = $temp$src;
					indent = $temp$indent;
					context = $temp$context;
					continue varHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$src = src,
						$temp$indent = indent,
						$temp$context = context;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					src = $temp$src;
					indent = $temp$indent;
					context = $temp$context;
					continue varHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$variable = function (i) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var firstOffset = A3($elm$parser$Parser$Advanced$isSubChar, i.start, s.offset, s.src);
			if (_Utils_eq(firstOffset, -1)) {
				return A2(
					$elm$parser$Parser$Advanced$Bad,
					false,
					A2($elm$parser$Parser$Advanced$fromState, s, i.expecting));
			} else {
				var s1 = _Utils_eq(firstOffset, -2) ? A7($elm$parser$Parser$Advanced$varHelp, i.inner, s.offset + 1, s.row + 1, 1, s.src, s.indent, s.context) : A7($elm$parser$Parser$Advanced$varHelp, i.inner, firstOffset, s.row, s.col + 1, s.src, s.indent, s.context);
				var name = A3($elm$core$String$slice, s.offset, s1.offset, s.src);
				return A2($elm$core$Set$member, name, i.reserved) ? A2(
					$elm$parser$Parser$Advanced$Bad,
					false,
					A2($elm$parser$Parser$Advanced$fromState, s, i.expecting)) : A3($elm$parser$Parser$Advanced$Good, true, name, s1);
			}
		});
};
var $elm$parser$Parser$variable = function (i) {
	return $elm$parser$Parser$Advanced$variable(
		{expecting: $elm$parser$Parser$ExpectingVariable, inner: i.inner, reserved: i.reserved, start: i.start});
};
var $author$project$MicroAgda$Parser$agdaName = $elm$parser$Parser$variable(
	{
		inner: $author$project$MicroAgda$Raw$isAgdaNameChar,
		reserved: $elm$core$Set$fromList(
			_List_fromArray(
				['let', 'in', 'case', 'of', '=', '≡', ':'])),
		start: $author$project$MicroAgda$Raw$isAgdaNameChar
	});
var $elm$parser$Parser$Advanced$andThen = F2(
	function (callback, _v0) {
		var parseA = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parseA(s0);
				if (_v1.$ === 'Bad') {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p1 = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					var _v2 = callback(a);
					var parseB = _v2.a;
					var _v3 = parseB(s1);
					if (_v3.$ === 'Bad') {
						var p2 = _v3.a;
						var x = _v3.b;
						return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
					} else {
						var p2 = _v3.a;
						var b = _v3.b;
						var s2 = _v3.c;
						return A3($elm$parser$Parser$Advanced$Good, p1 || p2, b, s2);
					}
				}
			});
	});
var $elm$parser$Parser$andThen = $elm$parser$Parser$Advanced$andThen;
var $author$project$MicroAgda$Raw$App = F2(
	function (a, b) {
		return {$: 'App', a: a, b: b};
	});
var $author$project$MicroAgda$Parser$appOp = F3(
	function (a, op, b) {
		return A2(
			$author$project$MicroAgda$Raw$App,
			A2($author$project$MicroAgda$Raw$App, op, a),
			b);
	});
var $elm$parser$Parser$Advanced$backtrackable = function (_v0) {
	var parse = _v0.a;
	return $elm$parser$Parser$Advanced$Parser(
		function (s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 'Bad') {
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, false, x);
			} else {
				var a = _v1.b;
				var s1 = _v1.c;
				return A3($elm$parser$Parser$Advanced$Good, false, a, s1);
			}
		});
};
var $author$project$MicroAgda$Parser$finalize = F2(
	function (l, y) {
		if (!l.b) {
			return y;
		} else {
			var x = l.a;
			var xs = l.b;
			return A2(
				$author$project$MicroAgda$Raw$App,
				A2($author$project$MicroAgda$Parser$finalize, xs, x),
				y);
		}
	});
var $elm$parser$Parser$Advanced$lazy = function (thunk) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v0 = thunk(_Utils_Tuple0);
			var parse = _v0.a;
			return parse(s);
		});
};
var $elm$parser$Parser$lazy = $elm$parser$Parser$Advanced$lazy;
var $elm$parser$Parser$Advanced$loopHelp = F4(
	function (p, state, callback, s0) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var parse = _v0.a;
			var _v1 = parse(s0);
			if (_v1.$ === 'Good') {
				var p1 = _v1.a;
				var step = _v1.b;
				var s1 = _v1.c;
				if (step.$ === 'Loop') {
					var newState = step.a;
					var $temp$p = p || p1,
						$temp$state = newState,
						$temp$callback = callback,
						$temp$s0 = s1;
					p = $temp$p;
					state = $temp$state;
					callback = $temp$callback;
					s0 = $temp$s0;
					continue loopHelp;
				} else {
					var result = step.a;
					return A3($elm$parser$Parser$Advanced$Good, p || p1, result, s1);
				}
			} else {
				var p1 = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p || p1, x);
			}
		}
	});
var $elm$parser$Parser$Advanced$loop = F2(
	function (state, callback) {
		return $elm$parser$Parser$Advanced$Parser(
			function (s) {
				return A4($elm$parser$Parser$Advanced$loopHelp, false, state, callback, s);
			});
	});
var $elm$parser$Parser$Advanced$map = F2(
	function (func, _v0) {
		var parse = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parse(s0);
				if (_v1.$ === 'Good') {
					var p = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p,
						func(a),
						s1);
				} else {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				}
			});
	});
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 'Append', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (_v1.$ === 'Good') {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
		});
};
var $elm$parser$Parser$Advanced$Done = function (a) {
	return {$: 'Done', a: a};
};
var $elm$parser$Parser$Advanced$Loop = function (a) {
	return {$: 'Loop', a: a};
};
var $elm$parser$Parser$Advanced$revAlways = F2(
	function (_v0, b) {
		return b;
	});
var $elm$parser$Parser$Advanced$skip = F2(
	function (iParser, kParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$parser$Parser$Advanced$revAlways, iParser, kParser);
	});
var $elm$parser$Parser$Advanced$sequenceEndForbidden = F5(
	function (ender, ws, parseItem, sep, revItems) {
		var chompRest = function (item) {
			return A5(
				$elm$parser$Parser$Advanced$sequenceEndForbidden,
				ender,
				ws,
				parseItem,
				sep,
				A2($elm$core$List$cons, item, revItems));
		};
		return A2(
			$elm$parser$Parser$Advanced$skip,
			ws,
			$elm$parser$Parser$Advanced$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$parser$Parser$Advanced$skip,
						sep,
						A2(
							$elm$parser$Parser$Advanced$skip,
							ws,
							A2(
								$elm$parser$Parser$Advanced$map,
								function (item) {
									return $elm$parser$Parser$Advanced$Loop(
										A2($elm$core$List$cons, item, revItems));
								},
								parseItem))),
						A2(
						$elm$parser$Parser$Advanced$map,
						function (_v0) {
							return $elm$parser$Parser$Advanced$Done(
								$elm$core$List$reverse(revItems));
						},
						ender)
					])));
	});
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A3($elm$parser$Parser$Advanced$Good, false, a, s);
		});
};
var $elm$parser$Parser$Advanced$sequenceEndMandatory = F4(
	function (ws, parseItem, sep, revItems) {
		return $elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$Advanced$map,
					function (item) {
						return $elm$parser$Parser$Advanced$Loop(
							A2($elm$core$List$cons, item, revItems));
					},
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						parseItem,
						A2(
							$elm$parser$Parser$Advanced$ignorer,
							ws,
							A2($elm$parser$Parser$Advanced$ignorer, sep, ws)))),
					A2(
					$elm$parser$Parser$Advanced$map,
					function (_v0) {
						return $elm$parser$Parser$Advanced$Done(
							$elm$core$List$reverse(revItems));
					},
					$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0))
				]));
	});
var $elm$parser$Parser$Advanced$sequenceEndOptional = F5(
	function (ender, ws, parseItem, sep, revItems) {
		var parseEnd = A2(
			$elm$parser$Parser$Advanced$map,
			function (_v0) {
				return $elm$parser$Parser$Advanced$Done(
					$elm$core$List$reverse(revItems));
			},
			ender);
		return A2(
			$elm$parser$Parser$Advanced$skip,
			ws,
			$elm$parser$Parser$Advanced$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$parser$Parser$Advanced$skip,
						sep,
						A2(
							$elm$parser$Parser$Advanced$skip,
							ws,
							$elm$parser$Parser$Advanced$oneOf(
								_List_fromArray(
									[
										A2(
										$elm$parser$Parser$Advanced$map,
										function (item) {
											return $elm$parser$Parser$Advanced$Loop(
												A2($elm$core$List$cons, item, revItems));
										},
										parseItem),
										parseEnd
									])))),
						parseEnd
					])));
	});
var $elm$parser$Parser$Advanced$sequenceEnd = F5(
	function (ender, ws, parseItem, sep, trailing) {
		var chompRest = function (item) {
			switch (trailing.$) {
				case 'Forbidden':
					return A2(
						$elm$parser$Parser$Advanced$loop,
						_List_fromArray(
							[item]),
						A4($elm$parser$Parser$Advanced$sequenceEndForbidden, ender, ws, parseItem, sep));
				case 'Optional':
					return A2(
						$elm$parser$Parser$Advanced$loop,
						_List_fromArray(
							[item]),
						A4($elm$parser$Parser$Advanced$sequenceEndOptional, ender, ws, parseItem, sep));
				default:
					return A2(
						$elm$parser$Parser$Advanced$ignorer,
						A2(
							$elm$parser$Parser$Advanced$skip,
							ws,
							A2(
								$elm$parser$Parser$Advanced$skip,
								sep,
								A2(
									$elm$parser$Parser$Advanced$skip,
									ws,
									A2(
										$elm$parser$Parser$Advanced$loop,
										_List_fromArray(
											[item]),
										A3($elm$parser$Parser$Advanced$sequenceEndMandatory, ws, parseItem, sep))))),
						ender);
			}
		};
		return $elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					A2($elm$parser$Parser$Advanced$andThen, chompRest, parseItem),
					A2(
					$elm$parser$Parser$Advanced$map,
					function (_v0) {
						return _List_Nil;
					},
					ender)
				]));
	});
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.offset, s.row, s.col, s.src);
			var newOffset = _v1.a;
			var newRow = _v1.b;
			var newCol = _v1.c;
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
				$elm$parser$Parser$Advanced$Good,
				progress,
				_Utils_Tuple0,
				{col: newCol, context: s.context, indent: s.indent, offset: newOffset, row: newRow, src: s.src});
		});
};
var $elm$parser$Parser$Advanced$sequence = function (i) {
	return A2(
		$elm$parser$Parser$Advanced$skip,
		$elm$parser$Parser$Advanced$token(i.start),
		A2(
			$elm$parser$Parser$Advanced$skip,
			i.spaces,
			A5(
				$elm$parser$Parser$Advanced$sequenceEnd,
				$elm$parser$Parser$Advanced$token(i.end),
				i.spaces,
				i.item,
				$elm$parser$Parser$Advanced$token(i.separator),
				i.trailing)));
};
var $elm$parser$Parser$Advanced$Forbidden = {$: 'Forbidden'};
var $elm$parser$Parser$Advanced$Mandatory = {$: 'Mandatory'};
var $elm$parser$Parser$Advanced$Optional = {$: 'Optional'};
var $elm$parser$Parser$toAdvancedTrailing = function (trailing) {
	switch (trailing.$) {
		case 'Forbidden':
			return $elm$parser$Parser$Advanced$Forbidden;
		case 'Optional':
			return $elm$parser$Parser$Advanced$Optional;
		default:
			return $elm$parser$Parser$Advanced$Mandatory;
	}
};
var $elm$parser$Parser$Expecting = function (a) {
	return {$: 'Expecting', a: a};
};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 'Token', a: a, b: b};
	});
var $elm$parser$Parser$toToken = function (str) {
	return A2(
		$elm$parser$Parser$Advanced$Token,
		str,
		$elm$parser$Parser$Expecting(str));
};
var $elm$parser$Parser$sequence = function (i) {
	return $elm$parser$Parser$Advanced$sequence(
		{
			end: $elm$parser$Parser$toToken(i.end),
			item: i.item,
			separator: $elm$parser$Parser$toToken(i.separator),
			spaces: i.spaces,
			start: $elm$parser$Parser$toToken(i.start),
			trailing: $elm$parser$Parser$toAdvancedTrailing(i.trailing)
		});
};
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.src);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.offset, offset) < 0,
					_Utils_Tuple0,
					{col: col, context: s0.context, indent: s0.indent, offset: offset, row: row, src: s0.src});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.offset, s.row, s.col, s);
		});
};
var $elm$parser$Parser$Advanced$spaces = $elm$parser$Parser$Advanced$chompWhile(
	function (c) {
		return _Utils_eq(
			c,
			_Utils_chr(' ')) || (_Utils_eq(
			c,
			_Utils_chr('\n')) || _Utils_eq(
			c,
			_Utils_chr('\r')));
	});
var $elm$parser$Parser$spaces = $elm$parser$Parser$Advanced$spaces;
var $author$project$MicroAgda$Parser$namesList = $elm$parser$Parser$sequence(
	{end: '', item: $author$project$MicroAgda$Parser$agdaName, separator: '', spaces: $elm$parser$Parser$spaces, start: '', trailing: $elm$parser$Parser$Forbidden});
var $elm$parser$Parser$oneOf = $elm$parser$Parser$Advanced$oneOf;
var $author$project$MicroAgda$Raw$Var = function (a) {
	return {$: 'Var', a: a};
};
var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
var $elm$parser$Parser$ExpectingSymbol = function (a) {
	return {$: 'ExpectingSymbol', a: a};
};
var $elm$parser$Parser$Advanced$symbol = $elm$parser$Parser$Advanced$token;
var $elm$parser$Parser$symbol = function (str) {
	return $elm$parser$Parser$Advanced$symbol(
		A2(
			$elm$parser$Parser$Advanced$Token,
			str,
			$elm$parser$Parser$ExpectingSymbol(str)));
};
var $author$project$MicroAgda$Parser$operator = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$keeper,
			$elm$parser$Parser$succeed(
				function (_v0) {
					return $author$project$MicroAgda$Raw$Var('Max');
				}),
			$elm$parser$Parser$symbol('∨')),
			A2(
			$elm$parser$Parser$keeper,
			$elm$parser$Parser$succeed(
				function (_v1) {
					return $author$project$MicroAgda$Raw$Var('Min');
				}),
			$elm$parser$Parser$symbol('∧'))
		]));
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $author$project$MicroAgda$Parser$varP = A2(
	$elm$parser$Parser$keeper,
	$elm$parser$Parser$succeed($author$project$MicroAgda$Raw$Var),
	$author$project$MicroAgda$Parser$agdaName);
var $author$project$MicroAgda$Parser$expressionHelp = F2(
	function (revOps, expr) {
		return $elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					$elm$parser$Parser$Advanced$backtrackable(
					A2(
						$elm$parser$Parser$andThen,
						function (newExpr) {
							return A2(
								$author$project$MicroAgda$Parser$expressionHelp,
								A2($elm$core$List$cons, expr, revOps),
								newExpr);
						},
						A2(
							$elm$parser$Parser$keeper,
							A2(
								$elm$parser$Parser$ignorer,
								$elm$parser$Parser$succeed($elm$core$Basics$identity),
								$elm$parser$Parser$spaces),
							$author$project$MicroAgda$Parser$cyclic$rawParser()))),
					$elm$parser$Parser$lazy(
					function (_v5) {
						return $elm$parser$Parser$succeed(
							A2($author$project$MicroAgda$Parser$finalize, revOps, expr));
					})
				]));
	});
function $author$project$MicroAgda$Parser$cyclic$piParser() {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$elm$parser$Parser$Advanced$backtrackable(
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						$elm$parser$Parser$succeed(
							$author$project$MicroAgda$Raw$Pi('unnamed')),
						A2(
							$elm$parser$Parser$ignorer,
							A2(
								$elm$parser$Parser$ignorer,
								A2(
									$elm$parser$Parser$ignorer,
									$author$project$MicroAgda$Parser$cyclic$expressionParser(),
									$elm$parser$Parser$spaces),
								$elm$parser$Parser$symbol('→')),
							$elm$parser$Parser$spaces)),
					$elm$parser$Parser$lazy(
						function (_v6) {
							return $author$project$MicroAgda$Parser$cyclic$piParser();
						}))),
				A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$ignorer,
							A2(
								$elm$parser$Parser$ignorer,
								A2(
									$elm$parser$Parser$ignorer,
									A2(
										$elm$parser$Parser$ignorer,
										$elm$parser$Parser$succeed(
											function (symL) {
												return function (dom) {
													return function (codom) {
														return A3(
															$elm$core$List$foldr,
															function (s) {
																return A2($author$project$MicroAgda$Raw$Pi, s, dom);
															},
															codom,
															symL);
													};
												};
											}),
										$elm$parser$Parser$symbol('∀')),
									$elm$parser$Parser$spaces),
								$elm$parser$Parser$symbol('(')),
							$elm$parser$Parser$spaces),
						A2(
							$elm$parser$Parser$ignorer,
							A2(
								$elm$parser$Parser$ignorer,
								A2($elm$parser$Parser$ignorer, $author$project$MicroAgda$Parser$namesList, $elm$parser$Parser$spaces),
								$elm$parser$Parser$symbol(':')),
							$elm$parser$Parser$spaces)),
					A2(
						$elm$parser$Parser$ignorer,
						A2(
							$elm$parser$Parser$ignorer,
							A2(
								$elm$parser$Parser$ignorer,
								A2(
									$elm$parser$Parser$ignorer,
									A2(
										$elm$parser$Parser$ignorer,
										$elm$parser$Parser$lazy(
											function (_v7) {
												return $author$project$MicroAgda$Parser$cyclic$piParser();
											}),
										$elm$parser$Parser$spaces),
									$elm$parser$Parser$symbol(')')),
								$elm$parser$Parser$spaces),
							$elm$parser$Parser$symbol('→')),
						$elm$parser$Parser$spaces)),
				$elm$parser$Parser$lazy(
					function (_v8) {
						return $author$project$MicroAgda$Parser$cyclic$piParser();
					})),
				$elm$parser$Parser$Advanced$backtrackable(
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$ignorer,
							A2(
								$elm$parser$Parser$ignorer,
								$elm$parser$Parser$succeed($author$project$MicroAgda$Raw$Lam),
								$elm$parser$Parser$symbol('λ')),
							$elm$parser$Parser$spaces),
						A2(
							$elm$parser$Parser$ignorer,
							A2(
								$elm$parser$Parser$ignorer,
								A2($elm$parser$Parser$ignorer, $author$project$MicroAgda$Parser$agdaName, $elm$parser$Parser$spaces),
								$elm$parser$Parser$symbol('→')),
							$elm$parser$Parser$spaces)),
					$elm$parser$Parser$lazy(
						function (_v9) {
							return $author$project$MicroAgda$Parser$cyclic$piParser();
						}))),
				$elm$parser$Parser$Advanced$backtrackable(
				$author$project$MicroAgda$Parser$cyclic$lamPParser()),
				$elm$parser$Parser$Advanced$backtrackable(
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							$elm$parser$Parser$succeed($author$project$MicroAgda$Parser$appOp),
							A2(
								$elm$parser$Parser$ignorer,
								$elm$parser$Parser$lazy(
									function (_v10) {
										return $author$project$MicroAgda$Parser$cyclic$expressionParser();
									}),
								$elm$parser$Parser$spaces)),
						A2($elm$parser$Parser$ignorer, $author$project$MicroAgda$Parser$operator, $elm$parser$Parser$spaces)),
					$elm$parser$Parser$lazy(
						function (_v11) {
							return $author$project$MicroAgda$Parser$cyclic$piParser();
						}))),
				$author$project$MicroAgda$Parser$cyclic$expressionParser()
			]));
}
function $author$project$MicroAgda$Parser$cyclic$expressionParser() {
	return A2(
		$elm$parser$Parser$andThen,
		$author$project$MicroAgda$Parser$expressionHelp(_List_Nil),
		$author$project$MicroAgda$Parser$cyclic$rawParser());
}
function $author$project$MicroAgda$Parser$cyclic$lamPParser() {
	return A2(
		$elm$parser$Parser$andThen,
		function (l) {
			return $elm$parser$Parser$succeed(
				$author$project$MicroAgda$Raw$LamP(l));
		},
		$elm$parser$Parser$sequence(
			{
				end: '}',
				item: A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$ignorer,
							$elm$parser$Parser$succeed($elm$core$Tuple$pair),
							$elm$parser$Parser$spaces),
						A2(
							$elm$parser$Parser$ignorer,
							A2(
								$elm$parser$Parser$ignorer,
								A2(
									$elm$parser$Parser$ignorer,
									$author$project$MicroAgda$Parser$cyclic$faceExprPaser(),
									$elm$parser$Parser$spaces),
								$elm$parser$Parser$symbol('→')),
							$elm$parser$Parser$spaces)),
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$lazy(
							function (_v4) {
								return $author$project$MicroAgda$Parser$cyclic$piParser();
							}),
						$elm$parser$Parser$spaces)),
				separator: ';',
				spaces: $elm$parser$Parser$spaces,
				start: 'λ {',
				trailing: $elm$parser$Parser$Forbidden
			}));
}
function $author$project$MicroAgda$Parser$cyclic$faceExprPaser() {
	return $elm$parser$Parser$sequence(
		{
			end: '',
			item: A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$ignorer,
						A2(
							$elm$parser$Parser$ignorer,
							A2(
								$elm$parser$Parser$ignorer,
								$elm$parser$Parser$succeed($elm$core$Tuple$pair),
								$elm$parser$Parser$spaces),
							$elm$parser$Parser$symbol('(')),
						$elm$parser$Parser$spaces),
					A2(
						$elm$parser$Parser$ignorer,
						A2(
							$elm$parser$Parser$ignorer,
							A2(
								$elm$parser$Parser$ignorer,
								$elm$parser$Parser$lazy(
									function (_v1) {
										return $author$project$MicroAgda$Parser$cyclic$piParser();
									}),
								$elm$parser$Parser$spaces),
							$elm$parser$Parser$symbol('=')),
						$elm$parser$Parser$spaces)),
				A2(
					$elm$parser$Parser$ignorer,
					A2(
						$elm$parser$Parser$ignorer,
						A2(
							$elm$parser$Parser$ignorer,
							$elm$parser$Parser$oneOf(
								_List_fromArray(
									[
										A2(
										$elm$parser$Parser$keeper,
										$elm$parser$Parser$succeed(
											function (_v2) {
												return true;
											}),
										$elm$parser$Parser$symbol('i1')),
										A2(
										$elm$parser$Parser$keeper,
										$elm$parser$Parser$succeed(
											function (_v3) {
												return false;
											}),
										$elm$parser$Parser$symbol('i0'))
									])),
							$elm$parser$Parser$spaces),
						$elm$parser$Parser$symbol(')')),
					$elm$parser$Parser$spaces)),
			separator: '',
			spaces: $elm$parser$Parser$spaces,
			start: '',
			trailing: $elm$parser$Parser$Optional
		});
}
function $author$project$MicroAgda$Parser$cyclic$rawParser() {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed($elm$core$Basics$identity),
						$elm$parser$Parser$symbol('(')),
					$elm$parser$Parser$spaces),
				A2(
					$elm$parser$Parser$ignorer,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$lazy(
							function (_v0) {
								return $author$project$MicroAgda$Parser$cyclic$piParser();
							}),
						$elm$parser$Parser$spaces),
					$elm$parser$Parser$symbol(')'))),
				$author$project$MicroAgda$Parser$varP
			]));
}
try {
	var $author$project$MicroAgda$Parser$piParser = $author$project$MicroAgda$Parser$cyclic$piParser();
	$author$project$MicroAgda$Parser$cyclic$piParser = function () {
		return $author$project$MicroAgda$Parser$piParser;
	};
	var $author$project$MicroAgda$Parser$expressionParser = $author$project$MicroAgda$Parser$cyclic$expressionParser();
	$author$project$MicroAgda$Parser$cyclic$expressionParser = function () {
		return $author$project$MicroAgda$Parser$expressionParser;
	};
	var $author$project$MicroAgda$Parser$lamPParser = $author$project$MicroAgda$Parser$cyclic$lamPParser();
	$author$project$MicroAgda$Parser$cyclic$lamPParser = function () {
		return $author$project$MicroAgda$Parser$lamPParser;
	};
	var $author$project$MicroAgda$Parser$faceExprPaser = $author$project$MicroAgda$Parser$cyclic$faceExprPaser();
	$author$project$MicroAgda$Parser$cyclic$faceExprPaser = function () {
		return $author$project$MicroAgda$Parser$faceExprPaser;
	};
	var $author$project$MicroAgda$Parser$rawParser = $author$project$MicroAgda$Parser$cyclic$rawParser();
	$author$project$MicroAgda$Parser$cyclic$rawParser = function () {
		return $author$project$MicroAgda$Parser$rawParser;
	};
} catch ($) {
	throw 'Some top-level definitions from `MicroAgda.Parser` are causing infinite recursion:\n\n  ┌─────┐\n  │    piParser\n  │     ↓\n  │    expressionParser\n  │     ↓\n  │    expressionHelp\n  │     ↓\n  │    lamPParser\n  │     ↓\n  │    faceExprPaser\n  │     ↓\n  │    rawParser\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $author$project$MicroAgda$Parser$mainParser = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($elm$core$Basics$identity),
		$elm$parser$Parser$spaces),
	A2(
		$elm$parser$Parser$ignorer,
		A2($elm$parser$Parser$ignorer, $author$project$MicroAgda$Parser$piParser, $elm$parser$Parser$spaces),
		$elm$parser$Parser$end));
var $elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {col: col, problem: problem, row: row};
	});
var $elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3($elm$parser$Parser$DeadEnd, p.row, p.col, p.problem);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 'Empty':
					return list;
				case 'AddRight':
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0.a;
		var _v1 = parse(
			{col: 1, context: _List_Nil, indent: 1, offset: 0, row: 1, src: src});
		if (_v1.$ === 'Good') {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $elm$parser$Parser$run = F2(
	function (parser, source) {
		var _v0 = A2($elm$parser$Parser$Advanced$run, parser, source);
		if (_v0.$ === 'Ok') {
			var a = _v0.a;
			return $elm$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $elm$core$Result$Err(
				A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $author$project$MicroAgda$Parser$parse = $elm$parser$Parser$run($author$project$MicroAgda$Parser$mainParser);
var $author$project$MicroAgda$File$parseDefinition = A2(
	$elm$core$Basics$composeR,
	$author$project$MicroAgda$File$defMap(
		function (_v0) {
			var _v1 = _v0.a;
			var si = _v1.a;
			var bo = _v1.b;
			var al = _v0.b;
			var da = _v0.c;
			return _Utils_Tuple3(
				_Utils_Tuple2(
					_Utils_Tuple2(
						si,
						$author$project$MicroAgda$Parser$parse(si)),
					_Utils_Tuple2(
						bo,
						$author$project$MicroAgda$Parser$parse(bo))),
				al,
				da);
		}),
	$author$project$MicroAgda$File$defMapSafe(
		function (_v2) {
			var _v3 = _v2.a;
			var _v4 = _v3.a;
			var si = _v4.a;
			var psi = _v4.b;
			var _v5 = _v3.b;
			var bo = _v5.a;
			var bsi = _v5.b;
			var al = _v2.b;
			var da = _v2.c;
			var _v6 = _Utils_Tuple2(psi, bsi);
			if ((_v6.a.$ === 'Ok') && (_v6.b.$ === 'Ok')) {
				var a = _v6.a.a;
				var b = _v6.b.a;
				return $elm$core$Maybe$Just(
					_Utils_Tuple3(
						_Utils_Tuple2(
							_Utils_Tuple2(si, a),
							_Utils_Tuple2(bo, b)),
						al,
						da));
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}));
var $author$project$MicroAgda$File$defHeadMap = F2(
	function (f, _v0) {
		var d = _v0.a;
		var _v1 = f(
			_Utils_Tuple3(
				_Utils_Tuple2(d.signature, d.body),
				d.args,
				d.data));
		var _v2 = _v1.a;
		var si = _v2.a;
		var bo = _v2.b;
		var al = _v1.b;
		var da = _v1.c;
		return $author$project$MicroAgda$File$Definition(
			{args: al, body: bo, data: da, name: d.name, signature: si, sub: d.sub});
	});
var $author$project$MicroAgda$Internal$Term$Interval = {$: 'Interval'};
var $author$project$MicroAgda$Internal$Term$betaEq = F2(
	function (t1, t2) {
		return true;
	});
var $author$project$MicroAgda$StringTools$absPreview = A2(
	$elm$core$Basics$composeR,
	$elm$core$List$indexedMap(
		function (i) {
			return function (s) {
				return '(' + ($elm$core$String$fromInt(i) + (':' + (s + ')')));
			};
		}),
	$elm$core$String$join(''));
var $author$project$MicroAgda$Internal$Term$buildInToken2String = function (b) {
	switch (b.$) {
		case 'Univ':
			return 'Type';
		case 'Level':
			return 'Level';
		case 'Level0':
			return 'ℓ-zero';
		case 'SucLevel':
			return 'ℓ-suc';
		case 'Interval':
			return 'I';
		case 'I0':
			return 'i0';
		case 'I1':
			return 'i1';
		case 'Max':
			return 'Max';
		case 'Min':
			return 'Min';
		case 'Neg':
			return '~';
		case 'Partial':
			return 'Partial';
		case 'IsOne':
			return 'IsOne';
		case 'OneIsOne':
			return '1=1';
		case 'Sub':
			return 'Sub';
		case 'Hcomp':
			return 'hcomp';
		case 'OutS':
			return 'outS';
		case 'PathP':
			return 'PathP';
		default:
			return 'inS';
	}
};
var $author$project$MicroAgda$Internal$Ctx$ctxPreview = A2(
	$elm$core$Basics$composeR,
	$author$project$MicroAgda$Internal$Ctx$ctxToList,
	A2(
		$elm$core$Basics$composeR,
		$elm$core$List$map($elm$core$Tuple$first),
		A2($elm$core$Basics$composeR, $elm$core$List$reverse, $author$project$MicroAgda$StringTools$absPreview)));
var $author$project$ResultExtra$lookByIntInList = F2(
	function (l, i) {
		lookByIntInList:
		while (true) {
			if (!l.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var x = l.a;
				var xs = l.b;
				if (!i) {
					return $elm$core$Maybe$Just(x);
				} else {
					var $temp$l = xs,
						$temp$i = i - 1;
					l = $temp$l;
					i = $temp$i;
					continue lookByIntInList;
				}
			}
		}
	});
var $author$project$MicroAgda$Internal$Ctx$lookNameByInt = F2(
	function (c, i) {
		return A2(
			$elm$core$Maybe$map,
			$elm$core$Tuple$first,
			A2(
				$author$project$ResultExtra$lookByIntInList,
				$elm$core$List$reverse(
					$author$project$MicroAgda$Internal$Ctx$ctxToList(c)),
				i));
	});
var $author$project$MicroAgda$StringTools$makeFresh2 = F2(
	function (_v0, l) {
		makeFresh2:
		while (true) {
			var s = _v0.a;
			var i = _v0.b;
			var actual = _Utils_ap(
				s,
				$elm$core$String$fromInt(i));
			if (A2($elm$core$Set$member, actual, l)) {
				var $temp$_v0 = _Utils_Tuple2(s, i + 1),
					$temp$l = l;
				_v0 = $temp$_v0;
				l = $temp$l;
				continue makeFresh2;
			} else {
				return actual;
			}
		}
	});
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $author$project$MicroAgda$StringTools$splitNameNumStep = function (_v0) {
	splitNameNumStep:
	while (true) {
		var lc = _v0.a;
		var li = _v0.b;
		if (!lc.b) {
			return _Utils_Tuple2(_List_Nil, li);
		} else {
			var x = lc.a;
			var xs = lc.b;
			if ($elm$core$Char$isDigit(x)) {
				var $temp$_v0 = _Utils_Tuple2(
					xs,
					_Utils_ap(
						$elm$core$String$fromChar(x),
						li));
				_v0 = $temp$_v0;
				continue splitNameNumStep;
			} else {
				return _Utils_Tuple2(lc, li);
			}
		}
	}
};
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $author$project$MicroAgda$StringTools$splitNameNum = function (s) {
	var rs = $elm$core$List$reverse(
		$elm$core$String$toList(s));
	var _v0 = $author$project$MicroAgda$StringTools$splitNameNumStep(
		_Utils_Tuple2(rs, ''));
	var ss = _v0.a;
	var li = _v0.b;
	return _Utils_Tuple2(
		$elm$core$String$fromList(
			$elm$core$List$reverse(ss)),
		A2(
			$elm$core$Maybe$withDefault,
			0,
			$elm$core$String$toInt(li)));
};
var $author$project$MicroAgda$StringTools$makeFresh = F2(
	function (x, l) {
		return A2($elm$core$Set$member, x, l) ? A2(
			$author$project$MicroAgda$StringTools$makeFresh2,
			$author$project$MicroAgda$StringTools$splitNameNum(x),
			l) : x;
	});
var $author$project$MicroAgda$Internal$Translate$newName = F2(
	function (ls, s) {
		return A2(
			$author$project$MicroAgda$StringTools$makeFresh,
			s,
			$elm$core$Set$fromList(ls));
	});
var $author$project$MicroAgda$Internal$Translate$swap = F3(
	function (f, b, a) {
		return A2(f, a, b);
	});
var $author$project$MicroAgda$Internal$Translate$foldInternalApp = F2(
	function (c, bnd) {
		return $elm$core$List$foldl(
			A2(
				$elm$core$Basics$composeR,
				$author$project$MicroAgda$Internal$Term$elimArg,
				A2(
					$elm$core$Basics$composeR,
					A2($author$project$MicroAgda$Internal$Translate$internal2raw, c, bnd),
					$author$project$MicroAgda$Internal$Translate$swap($author$project$MicroAgda$Raw$App))));
	});
var $author$project$MicroAgda$Internal$Translate$internal2raw = F3(
	function (c, bnd, t) {
		switch (t.$) {
			case 'Pi':
				var dt = t.a;
				var at = t.b;
				var nn = A2($author$project$MicroAgda$Internal$Translate$newName, bnd, at.absName);
				return A3(
					$author$project$MicroAgda$Raw$Pi,
					nn,
					A3($author$project$MicroAgda$Internal$Translate$internal2raw, c, bnd, dt.unDom),
					A3(
						$author$project$MicroAgda$Internal$Translate$internal2raw,
						c,
						A2($elm$core$List$cons, nn, bnd),
						at.unAbs));
			case 'Lam':
				var ai = t.a;
				var at = t.b;
				var nn = A2($author$project$MicroAgda$Internal$Translate$newName, bnd, at.absName);
				return A2(
					$author$project$MicroAgda$Raw$Lam,
					nn,
					A3(
						$author$project$MicroAgda$Internal$Translate$internal2raw,
						c,
						A2($elm$core$List$cons, nn, bnd),
						at.unAbs));
			case 'LamP':
				var pcs = t.a;
				var ee = t.b;
				return A4(
					$author$project$MicroAgda$Internal$Translate$foldInternalApp,
					c,
					bnd,
					$author$project$MicroAgda$Raw$LamP(
						A2(
							$elm$core$List$map,
							function (pc) {
								return _Utils_Tuple2(
									A2(
										$elm$core$List$map,
										function (_v1) {
											var ie = _v1.a;
											var b = _v1.b;
											return _Utils_Tuple2(
												A3($author$project$MicroAgda$Internal$Translate$internal2raw, c, bnd, ie),
												b);
										},
										pc.subFace),
									A3($author$project$MicroAgda$Internal$Translate$internal2raw, c, bnd, pc.body));
							},
							pcs)),
					ee);
			case 'Var':
				var j = t.a;
				var ee = t.b;
				return A4(
					$author$project$MicroAgda$Internal$Translate$foldInternalApp,
					c,
					bnd,
					$author$project$MicroAgda$Raw$Var(
						A2(
							$elm$core$Maybe$withDefault,
							'(INTERNAL ERR! wrng abs level! Translate.elm : ' + ($elm$core$String$fromInt(j) + (' ' + ($author$project$MicroAgda$StringTools$absPreview(bnd) + ')'))),
							A2(
								$elm$core$Maybe$map,
								function (nm) {
									return nm;
								},
								A2($author$project$ResultExtra$lookByIntInList, bnd, j)))),
					ee);
			case 'Def':
				if (t.a.$ === 'FromContext') {
					var j = t.a.a;
					var ee = t.b;
					return A4(
						$author$project$MicroAgda$Internal$Translate$foldInternalApp,
						c,
						bnd,
						$author$project$MicroAgda$Raw$Var(
							A2(
								$elm$core$Maybe$withDefault,
								'(INTERNAL ERR! not in scope! Translate.elm : ' + ($elm$core$String$fromInt(j) + (' ' + ($author$project$MicroAgda$Internal$Ctx$ctxPreview(c) + ')'))),
								A2($author$project$MicroAgda$Internal$Ctx$lookNameByInt, c, j))),
						ee);
				} else {
					var bi = t.a.a;
					var ee = t.b;
					return A4(
						$author$project$MicroAgda$Internal$Translate$foldInternalApp,
						c,
						bnd,
						$author$project$MicroAgda$Raw$Var(
							$author$project$MicroAgda$Internal$Term$buildInToken2String(bi)),
						ee);
				}
			default:
				return $author$project$MicroAgda$Raw$Var('TypeInf');
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_elm_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_elm_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_elm_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Set$remove = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return $elm$core$Set$Set_elm_builtin(
			A2($elm$core$Dict$remove, key, dict));
	});
var $elm$core$Set$singleton = function (key) {
	return $elm$core$Set$Set_elm_builtin(
		A2($elm$core$Dict$singleton, key, _Utils_Tuple0));
};
var $elm$core$Set$union = F2(
	function (_v0, _v1) {
		var dict1 = _v0.a;
		var dict2 = _v1.a;
		return $elm$core$Set$Set_elm_builtin(
			A2($elm$core$Dict$union, dict1, dict2));
	});
var $author$project$MicroAgda$Raw$freeVars = function (r) {
	switch (r.$) {
		case 'Pi':
			var s = r.a;
			var r1 = r.b;
			var r2 = r.c;
			return A2(
				$elm$core$Set$union,
				$author$project$MicroAgda$Raw$freeVars(r1),
				A2(
					$elm$core$Set$remove,
					s,
					$author$project$MicroAgda$Raw$freeVars(r2)));
		case 'Lam':
			var s = r.a;
			var r1 = r.b;
			return A2(
				$elm$core$Set$remove,
				s,
				$author$project$MicroAgda$Raw$freeVars(r1));
		case 'LamP':
			var lpc = r.a;
			return A3(
				$elm$core$List$foldl,
				function (x) {
					return $elm$core$Set$union(
						$author$project$MicroAgda$Raw$freeVarsPC(x));
				},
				$elm$core$Set$empty,
				lpc);
		case 'Var':
			var s = r.a;
			return $elm$core$Set$singleton(s);
		default:
			var r1 = r.a;
			var r2 = r.b;
			return A2(
				$elm$core$Set$union,
				$author$project$MicroAgda$Raw$freeVars(r1),
				$author$project$MicroAgda$Raw$freeVars(r2));
	}
};
var $author$project$MicroAgda$Raw$freeVarsPC = function (_v0) {
	var fe = _v0.a;
	var r = _v0.b;
	return A3(
		$elm$core$List$foldl,
		function (_v1) {
			var x = _v1.a;
			return $elm$core$Set$union(
				$author$project$MicroAgda$Raw$freeVars(x));
		},
		$author$project$MicroAgda$Raw$freeVars(r),
		fe);
};
var $author$project$MicroAgda$Raw$ifTputIntoP = F2(
	function (b, x) {
		if (!b) {
			return x;
		} else {
			return '( ' + (x + ' )');
		}
	});
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $author$project$MicroAgda$StringTools$indent = function (i) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$String$split('\n'),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$map(
				function (s) {
					return _Utils_ap(
						A2(
							$elm$core$String$join,
							'',
							A2($elm$core$List$repeat, i, ' ')),
						s);
				}),
			$elm$core$String$join('\n')));
};
var $author$project$MicroAgda$Raw$lamPCase2String = function (_v25) {
	var fe = _v25.a;
	var b = _v25.b;
	return '( ' + (A2(
		$elm$core$String$join,
		')(',
		A2(
			$elm$core$List$map,
			function (_v26) {
				var iE = _v26.a;
				var i = _v26.b;
				return $author$project$MicroAgda$Raw$cyclic$raw2String()(iE) + (' = ' + (i ? 'i1' : 'i0'));
			},
			fe)) + (' )' + (' → ' + $author$project$MicroAgda$Raw$cyclic$raw2String()(b))));
};
var $author$project$MicroAgda$Raw$raw2StringHlpAgda = F2(
	function (onRight, x) {
		var pathAware = true;
		var _v0 = _Utils_Tuple2(pathAware, x);
		_v0$11:
		while (true) {
			switch (_v0.b.$) {
				case 'Pi':
					var _v1 = _v0.b;
					var a = _v1.a;
					var b = _v1.b;
					var c = _v1.c;
					return '∀ (' + (a + (' : ' + ($author$project$MicroAgda$Raw$cyclic$raw2String()(b) + (') → ' + $author$project$MicroAgda$Raw$cyclic$raw2String()(c)))));
				case 'Lam':
					if ((_v0.b.b.$ === 'App') && (_v0.b.b.b.$ === 'Var')) {
						var _v2 = _v0.b;
						var a = _v2.a;
						var _v3 = _v2.b;
						var b = _v3.a;
						var d = _v3.b.a;
						if (_Utils_eq(a, d)) {
							return $author$project$MicroAgda$Raw$cyclic$raw2String()(b);
						} else {
							var c = A2(
								$author$project$MicroAgda$Raw$App,
								b,
								$author$project$MicroAgda$Raw$Var(d));
							return A2(
								$author$project$MicroAgda$Raw$ifTputIntoP,
								true,
								'λ ' + (a + (' → ' + $author$project$MicroAgda$Raw$cyclic$raw2String()(c))));
						}
					} else {
						var _v4 = _v0.b;
						var a = _v4.a;
						var c = _v4.b;
						return A2(
							$elm$core$Set$member,
							a,
							$author$project$MicroAgda$Raw$freeVars(c)) ? A2(
							$author$project$MicroAgda$Raw$ifTputIntoP,
							true,
							'λ ' + (a + (' → ' + $author$project$MicroAgda$Raw$cyclic$raw2String()(c)))) : A2(
							$author$project$MicroAgda$Raw$ifTputIntoP,
							true,
							'λ_→ ' + $author$project$MicroAgda$Raw$cyclic$raw2String()(c));
					}
				case 'Var':
					var a = _v0.b.a;
					return a;
				case 'App':
					if (_v0.b.a.$ === 'App') {
						switch (_v0.b.a.a.$) {
							case 'App':
								switch (_v0.b.a.a.a.$) {
									case 'Var':
										switch (_v0.b.a.a.a.a) {
											case 'hcomp':
												var _v7 = _v0.b;
												var _v8 = _v7.a;
												var _v9 = _v8.a;
												var a = _v9.b;
												var b = _v8.b;
												var c = _v7.b;
												return '(hcomp {' + ($author$project$MicroAgda$Raw$cyclic$raw2String()(a) + ('} {' + ($author$project$MicroAgda$Raw$cyclic$raw2String()(b) + ('} {' + ($author$project$MicroAgda$Raw$cyclic$raw2String()(c) + '} )')))));
											case 'hfill':
												var _v10 = _v0.b;
												var _v11 = _v10.a;
												var _v12 = _v11.a;
												var a = _v12.b;
												var b = _v11.b;
												var c = _v10.b;
												return '(hfill {' + ($author$project$MicroAgda$Raw$cyclic$raw2String()(a) + ('} {' + ($author$project$MicroAgda$Raw$cyclic$raw2String()(b) + ('} {' + ($author$project$MicroAgda$Raw$cyclic$raw2String()(c) + '} )')))));
											case 'inS':
												var _v13 = _v0.b;
												var _v14 = _v13.a;
												var _v15 = _v14.a;
												var a = _v15.b;
												var b = _v14.b;
												var c = _v13.b;
												return '(inS {' + ($author$project$MicroAgda$Raw$cyclic$raw2String()(a) + ('} {' + ($author$project$MicroAgda$Raw$cyclic$raw2String()(b) + ('} {' + ($author$project$MicroAgda$Raw$cyclic$raw2String()(c) + '} )')))));
											default:
												break _v0$11;
										}
									case 'App':
										if ((_v0.b.a.a.a.a.$ === 'Var') && (_v0.b.a.a.a.a.a === 'outS')) {
											var _v16 = _v0.b;
											var _v17 = _v16.a;
											var _v18 = _v17.a;
											var _v19 = _v18.a;
											var a = _v19.b;
											var b = _v18.b;
											var c = _v17.b;
											var d = _v16.b;
											return '(outS {' + ($author$project$MicroAgda$Raw$cyclic$raw2String()(a) + ('} {' + ($author$project$MicroAgda$Raw$cyclic$raw2String()(b) + ('} {' + ($author$project$MicroAgda$Raw$cyclic$raw2String()(c) + ('} {' + ($author$project$MicroAgda$Raw$cyclic$raw2String()(d) + '} )')))))));
										} else {
											break _v0$11;
										}
									default:
										break _v0$11;
								}
							case 'Var':
								switch (_v0.b.a.a.a) {
									case '_≡_':
										var _v5 = _v0.b;
										var _v6 = _v5.a;
										var a = _v6.b;
										var b = _v5.b;
										return $author$project$MicroAgda$Raw$cyclic$raw2String()(a) + (' ≡ ' + $author$project$MicroAgda$Raw$cyclic$raw2String()(b));
									case 'Max':
										var _v20 = _v0.b;
										var _v21 = _v20.a;
										var a = _v21.b;
										var b = _v20.b;
										return A2(
											$author$project$MicroAgda$Raw$ifTputIntoP,
											onRight,
											A2($author$project$MicroAgda$Raw$raw2StringHlpAgda, true, a) + (' ∨ ' + $author$project$MicroAgda$Raw$cyclic$raw2String()(b)));
									case 'Min':
										var _v22 = _v0.b;
										var _v23 = _v22.a;
										var a = _v23.b;
										var b = _v22.b;
										return A2(
											$author$project$MicroAgda$Raw$ifTputIntoP,
											onRight,
											A2($author$project$MicroAgda$Raw$raw2StringHlpAgda, true, a) + (' ∧ ' + $author$project$MicroAgda$Raw$cyclic$raw2String()(b)));
									default:
										break _v0$11;
								}
							default:
								break _v0$11;
						}
					} else {
						break _v0$11;
					}
				default:
					var l = _v0.b.a;
					return A2(
						$author$project$MicroAgda$StringTools$indent,
						3,
						'\n(λ {\n   ' + (A2(
							$author$project$MicroAgda$StringTools$indent,
							6,
							A2(
								$elm$core$String$join,
								'\n ; ',
								A2($elm$core$List$map, $author$project$MicroAgda$Raw$lamPCase2String, l))) + '\n   })\n'));
			}
		}
		var _v24 = _v0.b;
		var a = _v24.a;
		var b = _v24.b;
		return A2(
			$author$project$MicroAgda$Raw$ifTputIntoP,
			onRight,
			$author$project$MicroAgda$Raw$cyclic$raw2String()(a) + (' ' + A2($author$project$MicroAgda$Raw$raw2StringHlpAgda, true, b)));
	});
function $author$project$MicroAgda$Raw$cyclic$raw2String() {
	return $author$project$MicroAgda$Raw$raw2StringHlpAgda(false);
}
try {
	var $author$project$MicroAgda$Raw$raw2String = $author$project$MicroAgda$Raw$cyclic$raw2String();
	$author$project$MicroAgda$Raw$cyclic$raw2String = function () {
		return $author$project$MicroAgda$Raw$raw2String;
	};
} catch ($) {
	throw 'Some top-level definitions from `MicroAgda.Raw` are causing infinite recursion:\n\n  ┌─────┐\n  │    lamPCase2String\n  │     ↓\n  │    raw2String\n  │     ↓\n  │    raw2StringHlpAgda\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $author$project$MicroAgda$Internal$Ctx$toTm = function (_v0) {
	var t = _v0.a;
	return t;
};
var $author$project$MicroAgda$Internal$Translate$ct2str = function (c) {
	return A2(
		$elm$core$Basics$composeR,
		$author$project$MicroAgda$Internal$Ctx$toTm,
		A2(
			$elm$core$Basics$composeR,
			A2($author$project$MicroAgda$Internal$Translate$internal2raw, c, _List_Nil),
			$author$project$MicroAgda$Raw$raw2String));
};
var $author$project$MicroAgda$TypeChecker$notEqMsg = F3(
	function (c, tyExpected, tySpotted) {
		return 'Type error! expected: \n   ' + (A2($author$project$MicroAgda$Internal$Translate$ct2str, c, tyExpected) + ('\n    but spotted: ' + A2($author$project$MicroAgda$Internal$Translate$ct2str, c, tySpotted)));
	});
var $author$project$MicroAgda$TypeChecker$checkAgainst = F2(
	function (c, ty) {
		return $elm$core$Result$andThen(
			function (_v0) {
				var x = _v0.a;
				var ty1 = _v0.b;
				return A2(
					$author$project$MicroAgda$Internal$Term$betaEq,
					$author$project$MicroAgda$Internal$Ctx$toTm(ty),
					$author$project$MicroAgda$Internal$Ctx$toTm(ty1)) ? $elm$core$Result$Ok(x) : $elm$core$Result$Err(
					A3($author$project$MicroAgda$TypeChecker$notEqMsg, c, ty, ty1));
			});
	});
var $elm$core$Result$fromMaybe = F2(
	function (err, maybe) {
		if (maybe.$ === 'Just') {
			var v = maybe.a;
			return $elm$core$Result$Ok(v);
		} else {
			return $elm$core$Result$Err(err);
		}
	});
var $author$project$MicroAgda$TypeChecker$resMaybePopOut = function (e) {
	return $elm$core$Result$andThen(
		function (_v0) {
			var a = _v0.a;
			var mb = _v0.b;
			return A2(
				$elm$core$Result$map,
				$elm$core$Tuple$pair(a),
				A2($elm$core$Result$fromMaybe, e, mb));
		});
};
var $author$project$MicroAgda$Internal$Term$mkApp = F2(
	function (f, a) {
		return A2(
			$author$project$MicroAgda$Internal$Term$nfApp,
			f,
			_List_fromArray(
				[
					$author$project$MicroAgda$Internal$Term$Apply(
					{argInfo: $author$project$MicroAgda$Internal$ArgInfo$default, unArg: a})
				]));
	});
var $author$project$MicroAgda$Internal$Term$mkInterval = $author$project$MicroAgda$Internal$Term$buildIn($author$project$MicroAgda$Internal$Term$Interval);
var $author$project$MicroAgda$Internal$Term$toDom = function (a) {
	return {domInfo: $author$project$MicroAgda$Internal$ArgInfo$default, domName: $elm$core$Maybe$Nothing, unDom: a};
};
var $elm$core$Result$toMaybe = function (result) {
	if (result.$ === 'Ok') {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$MicroAgda$Internal$Term$yesAbs = F2(
	function (s, a) {
		return {absName: s, unAbs: a};
	});
var $author$project$MicroAgda$Internal$Term$toPiData = function (t) {
	_v0$2:
	while (true) {
		switch (t.$) {
			case 'Pi':
				var x = t.a;
				var y = t.b;
				return $elm$core$Maybe$Just(
					_Utils_Tuple2(x, y));
			case 'Def':
				if (((((((t.a.$ === 'BuildIn') && (t.a.a.$ === 'PathP')) && t.b.b) && t.b.b.b) && t.b.b.b.b) && t.b.b.b.b.b) && (!t.b.b.b.b.b.b)) {
					var _v1 = t.a.a;
					var _v2 = t.b;
					var _v3 = _v2.b;
					var a = _v3.a;
					var _v4 = _v3.b;
					var a0 = _v4.a;
					var _v5 = _v4.b;
					var a1 = _v5.a;
					return $elm$core$Result$toMaybe(
						A2(
							$elm$core$Result$map,
							function (q) {
								return _Utils_Tuple2(
									$author$project$MicroAgda$Internal$Term$toDom($author$project$MicroAgda$Internal$Term$mkInterval),
									A2($author$project$MicroAgda$Internal$Term$yesAbs, 'iii', q));
							},
							A2(
								$author$project$MicroAgda$Internal$Term$mkApp,
								$author$project$MicroAgda$Internal$Term$elimArg(a),
								A2($author$project$MicroAgda$Internal$Term$Var, 0, _List_Nil))));
				} else {
					break _v0$2;
				}
			default:
				break _v0$2;
		}
	}
	return $elm$core$Maybe$Nothing;
};
var $author$project$MicroAgda$TypeChecker$checkIfPi = function (e) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$Result$map(
			$elm$core$Tuple$mapSecond(
				A2($elm$core$Basics$composeR, $author$project$MicroAgda$Internal$Ctx$toTm, $author$project$MicroAgda$Internal$Term$toPiData))),
		$author$project$MicroAgda$TypeChecker$resMaybePopOut(e));
};
var $author$project$MicroAgda$Internal$Term$mkMax = F2(
	function (l, r) {
		return A2(
			$author$project$MicroAgda$Internal$Term$nfBI,
			$author$project$MicroAgda$Internal$Term$Max,
			_List_fromArray(
				[
					$author$project$MicroAgda$Internal$Term$elim(l),
					$author$project$MicroAgda$Internal$Term$elim(r)
				]));
	});
var $author$project$MicroAgda$Internal$Term$collectPartialPhi = A2(
	$elm$core$Basics$composeR,
	$elm$core$List$map(
		function (x) {
			return $author$project$MicroAgda$Internal$Term$subFace2Term(x.subFace);
		}),
	A2(
		$elm$core$List$foldr,
		$author$project$MicroAgda$Internal$Term$mkMax,
		$author$project$MicroAgda$Internal$Term$mkIEnd(false)));
var $author$project$MicroAgda$TypeChecker$ctUniv = $author$project$MicroAgda$Internal$Ctx$CT($author$project$MicroAgda$Internal$Term$Star);
var $author$project$MicroAgda$Internal$Ctx$extend = F3(
	function (c, s, cty) {
		return $author$project$MicroAgda$Internal$Ctx$listToCtxFull(
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					_Utils_Tuple2(s, cty),
					$elm$core$Maybe$Nothing),
				$author$project$MicroAgda$Internal$Ctx$ctxToListFull(c)));
	});
var $author$project$MicroAgda$Internal$Term$InS = {$: 'InS'};
var $author$project$MicroAgda$Internal$Term$Level = {$: 'Level'};
var $author$project$MicroAgda$Internal$Term$Level0 = {$: 'Level0'};
var $author$project$MicroAgda$Internal$Term$OutS = {$: 'OutS'};
var $author$project$MicroAgda$Internal$Term$Partial = {$: 'Partial'};
var $author$project$MicroAgda$Internal$Term$PathP = {$: 'PathP'};
var $author$project$MicroAgda$Internal$Term$Sub = {$: 'Sub'};
var $author$project$MicroAgda$Internal$Term$Univ = {$: 'Univ'};
var $author$project$MicroAgda$Internal$Term$mkPartial = F2(
	function (fTm, bTm) {
		return function (x) {
			return A2($author$project$MicroAgda$Internal$Term$LamP, x, _List_Nil);
		}(
			$author$project$MicroAgda$Internal$Term$partialCases(
				A2(
					$elm$core$List$map,
					function (x) {
						return A2($author$project$MicroAgda$Internal$Term$partialCase, x, bTm);
					},
					$author$project$MicroAgda$Internal$Term$subFace(fTm))));
	});
var $author$project$MicroAgda$Internal$Term$tmBIView = function (e) {
	_v0$4:
	while (true) {
		if ((e.$ === 'Def') && (e.a.$ === 'BuildIn')) {
			if (!e.b.b) {
				var bi = e.a.a;
				return $author$project$MicroAgda$Internal$Term$JB(bi);
			} else {
				if (!e.b.b.b) {
					var bi = e.a.a;
					var _v1 = e.b;
					var x = _v1.a;
					return A2(
						$author$project$MicroAgda$Internal$Term$JB1,
						bi,
						$author$project$MicroAgda$Internal$Term$toBIView(x));
				} else {
					if (!e.b.b.b.b) {
						var bi = e.a.a;
						var _v2 = e.b;
						var x = _v2.a;
						var _v3 = _v2.b;
						var y = _v3.a;
						return A3(
							$author$project$MicroAgda$Internal$Term$JB2,
							bi,
							$author$project$MicroAgda$Internal$Term$toBIView(x),
							$author$project$MicroAgda$Internal$Term$toBIView(y));
					} else {
						if (e.b.b.b.b.b && (!e.b.b.b.b.b.b)) {
							var bi = e.a.a;
							var _v4 = e.b;
							var x = _v4.a;
							var _v5 = _v4.b;
							var y = _v5.a;
							var _v6 = _v5.b;
							var z = _v6.a;
							var _v7 = _v6.b;
							var q = _v7.a;
							return A5(
								$author$project$MicroAgda$Internal$Term$JB4,
								bi,
								$author$project$MicroAgda$Internal$Term$toBIView(x),
								$author$project$MicroAgda$Internal$Term$toBIView(y),
								$author$project$MicroAgda$Internal$Term$toBIView(z),
								$author$project$MicroAgda$Internal$Term$toBIView(q));
						} else {
							break _v0$4;
						}
					}
				}
			}
		} else {
			break _v0$4;
		}
	}
	var t = e;
	return $author$project$MicroAgda$Internal$Term$JT(t);
};
var $author$project$MicroAgda$Internal$Term$toIsOne = function (t) {
	var _v0 = $author$project$MicroAgda$Internal$Term$tmBIView(t);
	if ((_v0.$ === 'JB1') && (_v0.a.$ === 'IsOne')) {
		var _v1 = _v0.a;
		var x = _v0.b;
		return $elm$core$Maybe$Just(
			$author$project$MicroAgda$Internal$Term$fromBIView(x));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$MicroAgda$Internal$Term$mkLam = A2(
	$elm$core$Basics$composeR,
	$author$project$MicroAgda$Internal$Term$toIsOne,
	A2(
		$elm$core$Basics$composeR,
		$elm$core$Maybe$map(
			function (i) {
				return function (at) {
					return A2($author$project$MicroAgda$Internal$Term$mkPartial, i, at.unAbs);
				};
			}),
		$elm$core$Maybe$withDefault($author$project$MicroAgda$Internal$Term$mkLamUnsafe)));
var $author$project$MicroAgda$Internal$Term$buildInTokensList = _List_fromArray(
	[
		_Utils_Tuple2(
		'Level',
		{bit: $author$project$MicroAgda$Internal$Term$Level, ty: $author$project$MicroAgda$Internal$Term$Star}),
		_Utils_Tuple2(
		'Type',
		{
			bit: $author$project$MicroAgda$Internal$Term$Univ,
			ty: A2(
				$author$project$MicroAgda$Internal$Term$Pi,
				$author$project$MicroAgda$Internal$Term$toDom(
					A2(
						$author$project$MicroAgda$Internal$Term$Def,
						$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$Level),
						_List_Nil)),
				$author$project$MicroAgda$Internal$Term$notAbs($author$project$MicroAgda$Internal$Term$Star))
		}),
		_Utils_Tuple2(
		'ℓ-zero',
		{
			bit: $author$project$MicroAgda$Internal$Term$Level0,
			ty: A2(
				$author$project$MicroAgda$Internal$Term$Def,
				$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$Level),
				_List_Nil)
		}),
		_Utils_Tuple2(
		'I',
		{bit: $author$project$MicroAgda$Internal$Term$Interval, ty: $author$project$MicroAgda$Internal$Term$Star}),
		_Utils_Tuple2(
		'i0',
		{
			bit: $author$project$MicroAgda$Internal$Term$I0,
			ty: A2(
				$author$project$MicroAgda$Internal$Term$Def,
				$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$Interval),
				_List_Nil)
		}),
		_Utils_Tuple2(
		'i1',
		{
			bit: $author$project$MicroAgda$Internal$Term$I1,
			ty: A2(
				$author$project$MicroAgda$Internal$Term$Def,
				$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$Interval),
				_List_Nil)
		}),
		_Utils_Tuple2(
		'Max',
		{
			bit: $author$project$MicroAgda$Internal$Term$Max,
			ty: A2(
				$author$project$MicroAgda$Internal$Term$Pi,
				$author$project$MicroAgda$Internal$Term$toDom(
					A2(
						$author$project$MicroAgda$Internal$Term$Def,
						$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$Interval),
						_List_Nil)),
				$author$project$MicroAgda$Internal$Term$notAbs(
					A2(
						$author$project$MicroAgda$Internal$Term$Pi,
						$author$project$MicroAgda$Internal$Term$toDom(
							A2(
								$author$project$MicroAgda$Internal$Term$Def,
								$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$Interval),
								_List_Nil)),
						$author$project$MicroAgda$Internal$Term$notAbs(
							A2(
								$author$project$MicroAgda$Internal$Term$Def,
								$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$Interval),
								_List_Nil)))))
		}),
		_Utils_Tuple2(
		'Min',
		{
			bit: $author$project$MicroAgda$Internal$Term$Min,
			ty: A2(
				$author$project$MicroAgda$Internal$Term$Pi,
				$author$project$MicroAgda$Internal$Term$toDom(
					A2(
						$author$project$MicroAgda$Internal$Term$Def,
						$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$Interval),
						_List_Nil)),
				$author$project$MicroAgda$Internal$Term$notAbs(
					A2(
						$author$project$MicroAgda$Internal$Term$Pi,
						$author$project$MicroAgda$Internal$Term$toDom(
							A2(
								$author$project$MicroAgda$Internal$Term$Def,
								$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$Interval),
								_List_Nil)),
						$author$project$MicroAgda$Internal$Term$notAbs(
							A2(
								$author$project$MicroAgda$Internal$Term$Def,
								$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$Interval),
								_List_Nil)))))
		}),
		_Utils_Tuple2(
		'~',
		{
			bit: $author$project$MicroAgda$Internal$Term$Neg,
			ty: A2(
				$author$project$MicroAgda$Internal$Term$Pi,
				$author$project$MicroAgda$Internal$Term$toDom(
					A2(
						$author$project$MicroAgda$Internal$Term$Def,
						$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$Interval),
						_List_Nil)),
				$author$project$MicroAgda$Internal$Term$notAbs(
					A2(
						$author$project$MicroAgda$Internal$Term$Def,
						$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$Interval),
						_List_Nil)))
		}),
		_Utils_Tuple2(
		'Partial',
		{
			bit: $author$project$MicroAgda$Internal$Term$Partial,
			ty: A2(
				$author$project$MicroAgda$Internal$Term$Pi,
				$author$project$MicroAgda$Internal$Term$toDom(
					A2(
						$author$project$MicroAgda$Internal$Term$Def,
						$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$Level),
						_List_Nil)),
				$author$project$MicroAgda$Internal$Term$notAbs(
					A2(
						$author$project$MicroAgda$Internal$Term$Pi,
						$author$project$MicroAgda$Internal$Term$toDom(
							A2(
								$author$project$MicroAgda$Internal$Term$Def,
								$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$Interval),
								_List_Nil)),
						$author$project$MicroAgda$Internal$Term$notAbs(
							A2(
								$author$project$MicroAgda$Internal$Term$Pi,
								$author$project$MicroAgda$Internal$Term$toDom($author$project$MicroAgda$Internal$Term$Star),
								$author$project$MicroAgda$Internal$Term$notAbs($author$project$MicroAgda$Internal$Term$Star))))))
		}),
		_Utils_Tuple2(
		'IsOne',
		{
			bit: $author$project$MicroAgda$Internal$Term$IsOne,
			ty: A2(
				$author$project$MicroAgda$Internal$Term$Pi,
				$author$project$MicroAgda$Internal$Term$toDom(
					A2(
						$author$project$MicroAgda$Internal$Term$Def,
						$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$Interval),
						_List_Nil)),
				$author$project$MicroAgda$Internal$Term$notAbs($author$project$MicroAgda$Internal$Term$Star))
		}),
		_Utils_Tuple2(
		'1=1',
		{
			bit: $author$project$MicroAgda$Internal$Term$OneIsOne,
			ty: A2(
				$author$project$MicroAgda$Internal$Term$Def,
				$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$IsOne),
				_List_fromArray(
					[
						$author$project$MicroAgda$Internal$Term$elim(
						A2(
							$author$project$MicroAgda$Internal$Term$Def,
							$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$I1),
							_List_Nil))
					]))
		}),
		_Utils_Tuple2(
		'Sub',
		{
			bit: $author$project$MicroAgda$Internal$Term$Sub,
			ty: A2(
				$author$project$MicroAgda$Internal$Term$mkPi,
				$author$project$MicroAgda$Internal$Term$buildIn($author$project$MicroAgda$Internal$Term$Level),
				$author$project$MicroAgda$Internal$Term$notAbs(
					A2(
						$author$project$MicroAgda$Internal$Term$mkPi,
						$author$project$MicroAgda$Internal$Term$Star,
						A2(
							$author$project$MicroAgda$Internal$Term$yesAbs,
							'A',
							A2(
								$author$project$MicroAgda$Internal$Term$mkPi,
								$author$project$MicroAgda$Internal$Term$buildIn($author$project$MicroAgda$Internal$Term$Interval),
								A2(
									$author$project$MicroAgda$Internal$Term$yesAbs,
									'φ',
									A2(
										$author$project$MicroAgda$Internal$Term$mkPi,
										A2(
											$author$project$MicroAgda$Internal$Term$mkPi,
											A2(
												$author$project$MicroAgda$Internal$Term$Def,
												$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$IsOne),
												_List_fromArray(
													[
														$author$project$MicroAgda$Internal$Term$elim(
														A2($author$project$MicroAgda$Internal$Term$Var, 0, _List_Nil))
													])),
											$author$project$MicroAgda$Internal$Term$notAbs(
												A2($author$project$MicroAgda$Internal$Term$Var, 2, _List_Nil))),
										$author$project$MicroAgda$Internal$Term$notAbs($author$project$MicroAgda$Internal$Term$Star))))))))
		}),
		_Utils_Tuple2(
		'outS',
		{
			bit: $author$project$MicroAgda$Internal$Term$OutS,
			ty: A2(
				$author$project$MicroAgda$Internal$Term$mkPi,
				$author$project$MicroAgda$Internal$Term$buildIn($author$project$MicroAgda$Internal$Term$Level),
				A2(
					$author$project$MicroAgda$Internal$Term$yesAbs,
					'l',
					A2(
						$author$project$MicroAgda$Internal$Term$mkPi,
						$author$project$MicroAgda$Internal$Term$Star,
						A2(
							$author$project$MicroAgda$Internal$Term$yesAbs,
							'A',
							A2(
								$author$project$MicroAgda$Internal$Term$mkPi,
								$author$project$MicroAgda$Internal$Term$buildIn($author$project$MicroAgda$Internal$Term$Interval),
								A2(
									$author$project$MicroAgda$Internal$Term$yesAbs,
									'φ',
									A2(
										$author$project$MicroAgda$Internal$Term$mkPi,
										A2(
											$author$project$MicroAgda$Internal$Term$mkPi,
											A2(
												$author$project$MicroAgda$Internal$Term$Def,
												$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$IsOne),
												_List_fromArray(
													[
														$author$project$MicroAgda$Internal$Term$elim(
														A2($author$project$MicroAgda$Internal$Term$Var, 0, _List_Nil))
													])),
											$author$project$MicroAgda$Internal$Term$notAbs(
												A2($author$project$MicroAgda$Internal$Term$Var, 2, _List_Nil))),
										A2(
											$author$project$MicroAgda$Internal$Term$yesAbs,
											'u',
											A2(
												$author$project$MicroAgda$Internal$Term$mkPi,
												A2(
													$author$project$MicroAgda$Internal$Term$Def,
													$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$Sub),
													_List_fromArray(
														[
															$author$project$MicroAgda$Internal$Term$elim(
															A2($author$project$MicroAgda$Internal$Term$Var, 3, _List_Nil)),
															$author$project$MicroAgda$Internal$Term$elim(
															A2($author$project$MicroAgda$Internal$Term$Var, 2, _List_Nil)),
															$author$project$MicroAgda$Internal$Term$elim(
															A2($author$project$MicroAgda$Internal$Term$Var, 1, _List_Nil)),
															$author$project$MicroAgda$Internal$Term$elim(
															A2($author$project$MicroAgda$Internal$Term$Var, 0, _List_Nil))
														])),
												$author$project$MicroAgda$Internal$Term$notAbs(
													A2($author$project$MicroAgda$Internal$Term$Var, 3, _List_Nil)))))))))))
		}),
		_Utils_Tuple2(
		'inS',
		{
			bit: $author$project$MicroAgda$Internal$Term$InS,
			ty: A2(
				$author$project$MicroAgda$Internal$Term$mkPi,
				$author$project$MicroAgda$Internal$Term$buildIn($author$project$MicroAgda$Internal$Term$Level),
				A2(
					$author$project$MicroAgda$Internal$Term$yesAbs,
					'l',
					A2(
						$author$project$MicroAgda$Internal$Term$mkPi,
						$author$project$MicroAgda$Internal$Term$Star,
						A2(
							$author$project$MicroAgda$Internal$Term$yesAbs,
							'A',
							A2(
								$author$project$MicroAgda$Internal$Term$mkPi,
								$author$project$MicroAgda$Internal$Term$buildIn($author$project$MicroAgda$Internal$Term$Interval),
								A2(
									$author$project$MicroAgda$Internal$Term$yesAbs,
									'φ',
									A2(
										$author$project$MicroAgda$Internal$Term$mkPi,
										A2($author$project$MicroAgda$Internal$Term$Var, 1, _List_Nil),
										A2(
											$author$project$MicroAgda$Internal$Term$yesAbs,
											'a',
											A2(
												$author$project$MicroAgda$Internal$Term$Def,
												$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$Sub),
												_List_fromArray(
													[
														$author$project$MicroAgda$Internal$Term$elim(
														A2($author$project$MicroAgda$Internal$Term$Var, 3, _List_Nil)),
														$author$project$MicroAgda$Internal$Term$elim(
														A2($author$project$MicroAgda$Internal$Term$Var, 2, _List_Nil)),
														$author$project$MicroAgda$Internal$Term$elim(
														A2($author$project$MicroAgda$Internal$Term$Var, 1, _List_Nil)),
														$author$project$MicroAgda$Internal$Term$elim(
														A2(
															$author$project$MicroAgda$Internal$Term$mkLam,
															A2(
																$author$project$MicroAgda$Internal$Term$Def,
																$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$IsOne),
																_List_fromArray(
																	[
																		$author$project$MicroAgda$Internal$Term$elim(
																		A2($author$project$MicroAgda$Internal$Term$Var, 1, _List_Nil))
																	])),
															$author$project$MicroAgda$Internal$Term$notAbs(
																A2($author$project$MicroAgda$Internal$Term$Var, 0, _List_Nil))))
													]))))))))))
		}),
		_Utils_Tuple2(
		'hcomp',
		{
			bit: $author$project$MicroAgda$Internal$Term$Hcomp,
			ty: A2(
				$author$project$MicroAgda$Internal$Term$mkPi,
				$author$project$MicroAgda$Internal$Term$buildIn($author$project$MicroAgda$Internal$Term$Level),
				A2(
					$author$project$MicroAgda$Internal$Term$yesAbs,
					'l',
					A2(
						$author$project$MicroAgda$Internal$Term$mkPi,
						$author$project$MicroAgda$Internal$Term$Star,
						A2(
							$author$project$MicroAgda$Internal$Term$yesAbs,
							'A',
							A2(
								$author$project$MicroAgda$Internal$Term$mkPi,
								$author$project$MicroAgda$Internal$Term$buildIn($author$project$MicroAgda$Internal$Term$Interval),
								A2(
									$author$project$MicroAgda$Internal$Term$yesAbs,
									'φ',
									A2(
										$author$project$MicroAgda$Internal$Term$mkPi,
										A2(
											$author$project$MicroAgda$Internal$Term$mkPi,
											$author$project$MicroAgda$Internal$Term$buildIn($author$project$MicroAgda$Internal$Term$Interval),
											$author$project$MicroAgda$Internal$Term$notAbs(
												A2(
													$author$project$MicroAgda$Internal$Term$mkPi,
													A2(
														$author$project$MicroAgda$Internal$Term$Def,
														$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$IsOne),
														_List_fromArray(
															[
																$author$project$MicroAgda$Internal$Term$elim(
																A2($author$project$MicroAgda$Internal$Term$Var, 1, _List_Nil))
															])),
													$author$project$MicroAgda$Internal$Term$notAbs(
														A2($author$project$MicroAgda$Internal$Term$Var, 3, _List_Nil))))),
										$author$project$MicroAgda$Internal$Term$notAbs(
											A2(
												$author$project$MicroAgda$Internal$Term$mkPi,
												A2($author$project$MicroAgda$Internal$Term$Var, 2, _List_Nil),
												$author$project$MicroAgda$Internal$Term$notAbs(
													A2($author$project$MicroAgda$Internal$Term$Var, 3, _List_Nil)))))))))))
		}),
		_Utils_Tuple2(
		'PathP',
		{
			bit: $author$project$MicroAgda$Internal$Term$PathP,
			ty: A2(
				$author$project$MicroAgda$Internal$Term$mkPi,
				$author$project$MicroAgda$Internal$Term$buildIn($author$project$MicroAgda$Internal$Term$Level),
				A2(
					$author$project$MicroAgda$Internal$Term$yesAbs,
					'l',
					A2(
						$author$project$MicroAgda$Internal$Term$mkPi,
						A2(
							$author$project$MicroAgda$Internal$Term$mkPi,
							$author$project$MicroAgda$Internal$Term$buildIn($author$project$MicroAgda$Internal$Term$Interval),
							$author$project$MicroAgda$Internal$Term$notAbs($author$project$MicroAgda$Internal$Term$Star)),
						A2(
							$author$project$MicroAgda$Internal$Term$yesAbs,
							'A',
							A2(
								$author$project$MicroAgda$Internal$Term$mkPi,
								A2(
									$author$project$MicroAgda$Internal$Term$Var,
									0,
									_List_fromArray(
										[
											$author$project$MicroAgda$Internal$Term$elim(
											A2(
												$author$project$MicroAgda$Internal$Term$Def,
												$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$I0),
												_List_Nil))
										])),
								$author$project$MicroAgda$Internal$Term$notAbs(
									A2(
										$author$project$MicroAgda$Internal$Term$mkPi,
										A2(
											$author$project$MicroAgda$Internal$Term$Var,
											1,
											_List_fromArray(
												[
													$author$project$MicroAgda$Internal$Term$elim(
													A2(
														$author$project$MicroAgda$Internal$Term$Def,
														$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$I0),
														_List_Nil))
												])),
										$author$project$MicroAgda$Internal$Term$notAbs($author$project$MicroAgda$Internal$Term$Star))))))))
		})
	]);
var $author$project$MicroAgda$Internal$Term$buildInTokensDict = $elm$core$Dict$fromList($author$project$MicroAgda$Internal$Term$buildInTokensList);
var $author$project$MicroAgda$Internal$Term$buildInLookup = function (s) {
	return A2(
		$elm$core$Maybe$map,
		function (x) {
			return _Utils_Tuple2(x.bit, x.ty);
		},
		A2($elm$core$Dict$get, s, $author$project$MicroAgda$Internal$Term$buildInTokensDict));
};
var $author$project$MicroAgda$TypeChecker$buildInLookupCT = function (s) {
	return A2(
		$elm$core$Maybe$map,
		$elm$core$Tuple$mapSecond($author$project$MicroAgda$Internal$Ctx$CT),
		$author$project$MicroAgda$Internal$Term$buildInLookup(s));
};
var $author$project$MicroAgda$Internal$Term$ctxVar = function (i) {
	return A2(
		$author$project$MicroAgda$Internal$Term$Def,
		$author$project$MicroAgda$Internal$Term$FromContext(i),
		_List_Nil);
};
var $author$project$MicroAgda$Internal$Term$ifErr = F2(
	function (spare, def) {
		if (def.$ === 'Ok') {
			var a = def.a;
			return $elm$core$Result$Ok(a);
		} else {
			var e = def.a;
			return spare;
		}
	});
var $author$project$MicroAgda$Internal$Ctx$lookByNameInListWithIndex = F2(
	function (c, s) {
		if (!c.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v1 = c.a;
			var n = _v1.a;
			var ty = _v1.b;
			var xs = c.b;
			return _Utils_eq(n, s) ? $elm$core$Maybe$Just(
				_Utils_Tuple2(0, ty)) : A2(
				$elm$core$Maybe$map,
				$elm$core$Tuple$mapFirst(
					function (j) {
						return j + 1;
					}),
				A2($author$project$MicroAgda$Internal$Ctx$lookByNameInListWithIndex, xs, s));
		}
	});
var $author$project$MicroAgda$Internal$Ctx$lookByNameWithIndexFull = function (c) {
	return A2(
		$elm$core$Basics$composeR,
		$author$project$MicroAgda$Internal$Ctx$lookByNameInListWithIndex(
			A2(
				$elm$core$List$map,
				function (_v0) {
					var _v1 = _v0.a;
					var q = _v1.a;
					var w = _v1.b;
					var e = _v0.b;
					return _Utils_Tuple2(
						q,
						_Utils_Tuple2(w, e));
				},
				$author$project$MicroAgda$Internal$Ctx$ctxToListFull(c))),
		$elm$core$Maybe$map(
			$elm$core$Tuple$mapFirst(
				function (x) {
					return ($elm$core$List$length(
						$author$project$MicroAgda$Internal$Ctx$ctxToListFull(c)) - 1) - x;
				})));
};
var $author$project$MicroAgda$TypeChecker$lookInCtx = F3(
	function (e, c, s) {
		if (s === 'TypeInf') {
			return $elm$core$Result$Ok(
				_Utils_Tuple2(
					$author$project$MicroAgda$Internal$Term$Star,
					$author$project$MicroAgda$Internal$Ctx$CT($author$project$MicroAgda$Internal$Term$Star)));
		} else {
			var qn = A2($author$project$MicroAgda$Internal$Ctx$lookByNameWithIndexFull, c, s);
			return A2(
				$author$project$MicroAgda$Internal$Term$ifErr,
				A2(
					$elm$core$Result$map,
					$elm$core$Tuple$mapFirst($author$project$MicroAgda$Internal$Term$buildIn),
					A2(
						$elm$core$Result$fromMaybe,
						e,
						$author$project$MicroAgda$TypeChecker$buildInLookupCT(s))),
				A2(
					$elm$core$Result$map,
					function (_v0) {
						var nm = _v0.a;
						var _v1 = _v0.b;
						var ct = _v1.a;
						var mbTm = _v1.b;
						return _Utils_Tuple2(
							A2(
								$elm$core$Maybe$withDefault,
								$author$project$MicroAgda$Internal$Term$ctxVar(nm),
								mbTm),
							ct);
					},
					A2($elm$core$Result$fromMaybe, e, qn)));
		}
	});
var $author$project$MicroAgda$Internal$Term$mkPathApp = F3(
	function (_v0, f, a) {
		var e0 = _v0.a;
		var e1 = _v0.b;
		return A2(
			$author$project$MicroAgda$Internal$Term$nfApp,
			f,
			_List_fromArray(
				[
					A3($author$project$MicroAgda$Internal$Term$IApply, e0, e1, a)
				]));
	});
var $author$project$MicroAgda$TypeChecker$notPartialMsg = F2(
	function (c, tySpotted) {
		return 'Type error! \n   expected: ' + ('Partial Type' + ('\n   but spotted: ' + A2($author$project$MicroAgda$Internal$Translate$ct2str, c, tySpotted)));
	});
var $author$project$MicroAgda$TypeChecker$notPiMsg = F2(
	function (c, tySpotted) {
		return 'Type error! expected: ' + ('some PiType' + (' but spotted: ' + A2($author$project$MicroAgda$Internal$Translate$ct2str, c, tySpotted)));
	});
var $author$project$MicroAgda$Internal$Term$piApp = F2(
	function (_v0, arg) {
		var at = _v0.b;
		return A2($author$project$MicroAgda$Internal$Term$absApply, at, arg);
	});
var $author$project$MicroAgda$TypeChecker$resTuple = function (x) {
	if (x.b.$ === 'Err') {
		var e = x.b.a;
		return $elm$core$Result$Err(e);
	} else {
		if (x.a.$ === 'Err') {
			var e = x.a.a;
			return $elm$core$Result$Err(e);
		} else {
			var a = x.a.a;
			var b = x.b.a;
			return $elm$core$Result$Ok(
				_Utils_Tuple2(a, b));
		}
	}
};
var $author$project$MicroAgda$Internal$Term$buildInNamesSet = $elm$core$Set$fromList(
	A2(
		$elm$core$List$cons,
		'TypeInf',
		A2($elm$core$List$map, $elm$core$Tuple$first, $author$project$MicroAgda$Internal$Term$buildInTokensList)));
var $elm$core$Dict$filter = F2(
	function (isGood, dict) {
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (k, v, d) {
					return A2(isGood, k, v) ? A3($elm$core$Dict$insert, k, v, d) : d;
				}),
			$elm$core$Dict$empty,
			dict);
	});
var $elm$core$Set$filter = F2(
	function (isGood, _v0) {
		var dict = _v0.a;
		return $elm$core$Set$Set_elm_builtin(
			A2(
				$elm$core$Dict$filter,
				F2(
					function (key, _v1) {
						return isGood(key);
					}),
				dict));
	});
var $elm$core$Set$foldl = F3(
	function (func, initialState, _v0) {
		var dict = _v0.a;
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (key, _v1, state) {
					return A2(func, key, state);
				}),
			initialState,
			dict);
	});
var $elm$core$Dict$isEmpty = function (dict) {
	if (dict.$ === 'RBEmpty_elm_builtin') {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Set$isEmpty = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$isEmpty(dict);
};
var $elm$core$Dict$values = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return A2($elm$core$List$cons, value, valueList);
			}),
		_List_Nil,
		dict);
};
var $author$project$MicroAgda$StringTools$makeFreshDict = function (l) {
	return A3(
		$elm$core$Set$foldl,
		function (s) {
			return function (d) {
				return A3(
					$elm$core$Dict$insert,
					s,
					A2(
						$author$project$MicroAgda$StringTools$makeFresh,
						s,
						A2(
							$elm$core$Set$union,
							l,
							$elm$core$Set$fromList(
								$elm$core$Dict$values(d)))),
					d);
			};
		},
		$elm$core$Dict$empty,
		l);
};
var $author$project$MicroAgda$StringTools$dictSubst = F2(
	function (di, s) {
		return A2(
			$elm$core$Maybe$withDefault,
			s,
			A2($elm$core$Dict$get, s, di));
	});
var $elm$core$Tuple$mapBoth = F3(
	function (funcA, funcB, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			funcA(x),
			funcB(y));
	});
var $author$project$MicroAgda$Raw$mapPartialCase = function (f) {
	return $elm$core$List$map(
		A2(
			$elm$core$Tuple$mapBoth,
			$elm$core$List$map(
				$elm$core$Tuple$mapFirst(f)),
			f));
};
var $author$project$MicroAgda$Raw$renameAbsDIns = F3(
	function (di, se, r) {
		var ria = F3(
			function (h, ss, rr) {
				var _v1 = A2($elm$core$Dict$get, ss, di);
				if (_v1.$ === 'Just') {
					var ss2 = _v1.a;
					return A2(
						h,
						ss2,
						A3(
							$author$project$MicroAgda$Raw$renameAbsDIns,
							di,
							A2($elm$core$Set$insert, ss, se),
							rr));
				} else {
					return A2(
						h,
						ss,
						A3($author$project$MicroAgda$Raw$renameAbsDIns, di, se, rr));
				}
			});
		switch (r.$) {
			case 'Pi':
				var s = r.a;
				var r1 = r.b;
				var r2 = r.c;
				return A3(
					ria,
					function (sA) {
						return function (r2A) {
							return A3(
								$author$project$MicroAgda$Raw$Pi,
								sA,
								A3($author$project$MicroAgda$Raw$renameAbsDIns, di, se, r1),
								r2A);
						};
					},
					s,
					r2);
			case 'Lam':
				var s = r.a;
				var r1 = r.b;
				return A3(ria, $author$project$MicroAgda$Raw$Lam, s, r1);
			case 'LamP':
				var lpc = r.a;
				return $author$project$MicroAgda$Raw$LamP(
					A2(
						$author$project$MicroAgda$Raw$mapPartialCase,
						A2($author$project$MicroAgda$Raw$renameAbsDIns, di, se),
						lpc));
			case 'Var':
				var s = r.a;
				return $author$project$MicroAgda$Raw$Var(
					A2($elm$core$Set$member, s, se) ? A2($author$project$MicroAgda$StringTools$dictSubst, di, s) : s);
			default:
				var r1 = r.a;
				var r2 = r.b;
				return A2(
					$author$project$MicroAgda$Raw$App,
					A3($author$project$MicroAgda$Raw$renameAbsDIns, di, se, r1),
					A3($author$project$MicroAgda$Raw$renameAbsDIns, di, se, r2));
		}
	});
var $author$project$MicroAgda$Raw$renameAbsD = function (di) {
	return A2($author$project$MicroAgda$Raw$renameAbsDIns, di, $elm$core$Set$empty);
};
var $author$project$MicroAgda$Raw$renameAbs = A2($elm$core$Basics$composeR, $author$project$MicroAgda$StringTools$makeFreshDict, $author$project$MicroAgda$Raw$renameAbsD);
var $author$project$MicroAgda$Raw$fixAbsNames = F2(
	function (defInCtx, r) {
		var undefs = A2(
			$elm$core$Set$filter,
			function (x) {
				return (!A2($elm$core$Set$member, x, defInCtx)) && (!A2($elm$core$Set$member, x, $author$project$MicroAgda$Internal$Term$buildInNamesSet));
			},
			$author$project$MicroAgda$Raw$freeVars(r));
		return $elm$core$Set$isEmpty(undefs) ? $elm$core$Result$Ok(
			A2(
				$author$project$MicroAgda$Raw$renameAbs,
				A2($elm$core$Set$union, defInCtx, $author$project$MicroAgda$Internal$Term$buildInNamesSet),
				r)) : $elm$core$Result$Err(
			'fixAbsNames : undefined: ' + A3(
				$elm$core$Set$foldl,
				function (x) {
					return function (y) {
						return x + (', ' + y);
					};
				},
				'',
				undefs));
	});
var $author$project$MicroAgda$Internal$Ctx$symbolsSet = A2(
	$elm$core$Basics$composeR,
	$author$project$MicroAgda$Internal$Ctx$ctxToList,
	A2(
		$elm$core$Basics$composeR,
		$elm$core$List$map($elm$core$Tuple$first),
		$elm$core$Set$fromList));
var $author$project$MicroAgda$TypeChecker$scopeCheck = A2($elm$core$Basics$composeR, $author$project$MicroAgda$Internal$Ctx$symbolsSet, $author$project$MicroAgda$Raw$fixAbsNames);
var $author$project$MicroAgda$TypeChecker$substList = function (c) {
	return $author$project$ResultExtra$mapListResult(
		function (_v0) {
			var it = _v0.a;
			var b = _v0.b;
			if (((it.$ === 'Def') && (it.a.$ === 'FromContext')) && (!it.b.b)) {
				var i = it.a.a;
				return A2(
					$elm$core$Result$fromMaybe,
					'fatal err 2',
					A2(
						$elm$core$Maybe$map,
						function (z) {
							return _Utils_Tuple2(
								_Utils_Tuple2(z, i),
								b);
						},
						A2($author$project$MicroAgda$Internal$Ctx$lookNameByInt, c, i)));
			} else {
				return $elm$core$Result$Err('fatal err');
			}
		});
};
var $author$project$MicroAgda$Internal$Ctx$lookByInt = F2(
	function (c, i) {
		return A2(
			$elm$core$Maybe$map,
			$elm$core$Tuple$second,
			A2(
				$author$project$ResultExtra$lookByIntInList,
				$elm$core$List$reverse(
					$author$project$MicroAgda$Internal$Ctx$ctxToList(c)),
				i));
	});
var $author$project$ResultExtra$mapHead = F2(
	function (f, l) {
		if (!l.b) {
			return _List_Nil;
		} else {
			var x = l.a;
			var xs = l.b;
			return A2(
				$elm$core$List$cons,
				f(x),
				xs);
		}
	});
var $author$project$ResultExtra$maybeMixRes = A2(
	$elm$core$Basics$composeR,
	$elm$core$Maybe$map(
		$elm$core$Result$map($elm$core$Maybe$Just)),
	$elm$core$Maybe$withDefault(
		$elm$core$Result$Ok($elm$core$Maybe$Nothing)));
var $author$project$MicroAgda$Internal$Ctx$substInCtx2 = F3(
	function (_v6, i, _v7) {
		var c = _v6.a;
		var t = _v6.b;
		var x = _v7.a;
		var ct = _v7.b;
		var _v8 = A2($author$project$MicroAgda$Internal$Ctx$lookByInt, c, i);
		if (_v8.$ === 'Nothing') {
			return $elm$core$Result$Ok(
				_Utils_Tuple2(c, t));
		} else {
			var ctt = _v8.a;
			return A2(
				$author$project$MicroAgda$Internal$Term$betaEq,
				$author$project$MicroAgda$Internal$Ctx$toTm(ctt),
				$author$project$MicroAgda$Internal$Ctx$toTm(ct)) ? (_Utils_eq(
				i,
				$author$project$MicroAgda$Internal$Ctx$youngestSymbolId(c)) ? A3(
				$author$project$MicroAgda$Internal$Ctx$unsafeSubstInCtx2,
				_Utils_Tuple2(
					A2(
						$author$project$ResultExtra$mapHead,
						function (_v9) {
							var _v10 = _v9.a;
							var q = _v10.a;
							var w = _v10.b;
							return _Utils_Tuple2(
								_Utils_Tuple2(q, w),
								$elm$core$Maybe$Just(x));
						},
						c),
					t),
				i,
				_Utils_Tuple2(x, ct)) : A3(
				$author$project$MicroAgda$Internal$Ctx$unsafeSubstInCtx2,
				_Utils_Tuple2(c, t),
				i,
				_Utils_Tuple2(x, ct))) : $elm$core$Result$Err('Wrong type while substituting');
		}
	});
var $author$project$MicroAgda$Internal$Ctx$unsafeSubstInCtx2 = F3(
	function (_v0, i, _v1) {
		var c = _v0.a;
		var t = _v0.b;
		var x = _v1.a;
		var ct = _v1.b;
		if (!c.b) {
			return $elm$core$Result$Ok(
				_Utils_Tuple2(c, t));
		} else {
			var _v3 = c.a;
			var _v4 = _v3.a;
			var n = _v4.a;
			var ty = _v4.b.a;
			var mbt = _v3.b;
			var ctl = c.b;
			return A2(
				$elm$core$Result$andThen,
				function (mbt2) {
					return A2(
						$author$project$ResultExtra$thenPairResult,
						function (_v5) {
							var cc = _v5.a;
							var ty2 = _v5.b;
							return function (b) {
								return $elm$core$Result$Ok(
									_Utils_Tuple2(
										A2(
											$elm$core$List$cons,
											_Utils_Tuple2(
												_Utils_Tuple2(
													n,
													$author$project$MicroAgda$Internal$Ctx$CT(ty2)),
												mbt2),
											cc),
										b));
							};
						},
						_Utils_Tuple2(
							A3(
								$author$project$MicroAgda$Internal$Ctx$substInCtx2,
								_Utils_Tuple2(ctl, ty),
								i,
								_Utils_Tuple2(x, ct)),
							A3($author$project$MicroAgda$Internal$Term$substIC2, i, x, t)));
				},
				$author$project$ResultExtra$maybeMixRes(
					A2(
						$elm$core$Maybe$map,
						A2($author$project$MicroAgda$Internal$Term$substIC2, i, x),
						mbt)));
		}
	});
var $author$project$MicroAgda$TypeChecker$substOnFace = A2(
	$elm$core$Basics$composeR,
	$elm$core$Result$Ok,
	$elm$core$List$foldr(
		function (_v0) {
			var _v1 = _v0.a;
			var n = _v1.a;
			var i = _v1.b;
			var b = _v0.b;
			return $elm$core$Result$andThen(
				function (ct) {
					return A3(
						$author$project$MicroAgda$Internal$Ctx$substInCtx2,
						ct,
						i,
						_Utils_Tuple2(
							$author$project$MicroAgda$Internal$Term$mkIEnd(b),
							$author$project$MicroAgda$Internal$Ctx$CT($author$project$MicroAgda$Internal$Term$mkInterval)));
				});
		}));
var $author$project$MicroAgda$TypeChecker$thenResultFold = F3(
	function (f, la, rb) {
		return A3(
			$elm$core$List$foldl,
			A2($elm$core$Basics$composeR, f, $elm$core$Result$andThen),
			rb,
			la);
	});
var $author$project$MicroAgda$Internal$Term$toPartialDom = A2(
	$elm$core$Basics$composeR,
	$author$project$MicroAgda$Internal$Term$toPiData,
	$elm$core$Maybe$map(
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Tuple$second,
			function (x) {
				return x.unAbs;
			})));
var $author$project$MicroAgda$Internal$Term$toPartialPhi = A2(
	$elm$core$Basics$composeR,
	$author$project$MicroAgda$Internal$Term$toPiData,
	A2(
		$elm$core$Basics$composeR,
		$elm$core$Maybe$map(
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Tuple$first,
				function (x) {
					return x.unDom;
				})),
		$elm$core$Maybe$andThen(
			function (x) {
				var _v0 = $author$project$MicroAgda$Internal$Term$toBIView(
					$author$project$MicroAgda$Internal$Term$elim(x));
				if ((_v0.$ === 'JB1') && (_v0.a.$ === 'IsOne')) {
					var _v1 = _v0.a;
					var y = _v0.b;
					return $elm$core$Maybe$Just(
						$author$project$MicroAgda$Internal$Term$fromBIView(y));
				} else {
					return $elm$core$Maybe$Nothing;
				}
			})));
var $author$project$MicroAgda$Internal$Term$toPathData = function (t) {
	if ((((((((t.$ === 'Def') && (t.a.$ === 'BuildIn')) && (t.a.a.$ === 'PathP')) && t.b.b) && t.b.b.b) && t.b.b.b.b) && t.b.b.b.b.b) && (!t.b.b.b.b.b.b)) {
		var _v1 = t.a.a;
		var _v2 = t.b;
		var _v3 = _v2.b;
		var a = _v3.a;
		var _v4 = _v3.b;
		var a0 = _v4.a;
		var _v5 = _v4.b;
		var a1 = _v5.a;
		return $elm$core$Result$toMaybe(
			A2(
				$elm$core$Result$map,
				function (q) {
					return _Utils_Tuple2(
						$author$project$MicroAgda$Internal$Term$elimArg(a0),
						$author$project$MicroAgda$Internal$Term$elimArg(a1));
				},
				A2(
					$author$project$MicroAgda$Internal$Term$mkApp,
					$author$project$MicroAgda$Internal$Term$elimArg(a),
					A2($author$project$MicroAgda$Internal$Term$Var, 0, _List_Nil))));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$MicroAgda$TypeChecker$tupleMapBoth2 = F2(
	function (_v0, a) {
		var f = _v0.a;
		var g = _v0.b;
		return _Utils_Tuple2(
			f(a),
			g(a));
	});
var $author$project$MicroAgda$Raw$substUnsafe = F3(
	function (sym, x, r) {
		var f = A2($author$project$MicroAgda$Raw$substUnsafe, sym, x);
		switch (r.$) {
			case 'Pi':
				var s = r.a;
				var r1 = r.b;
				var r2 = r.c;
				return A3(
					$author$project$MicroAgda$Raw$Pi,
					s,
					f(r1),
					f(r2));
			case 'Lam':
				var s = r.a;
				var r1 = r.b;
				return A2(
					$author$project$MicroAgda$Raw$Lam,
					s,
					f(r1));
			case 'LamP':
				var lpc = r.a;
				return $author$project$MicroAgda$Raw$LamP(
					A2(
						$elm$core$List$map,
						function (_v1) {
							var lf = _v1.a;
							var b = _v1.b;
							return _Utils_Tuple2(
								A2(
									$elm$core$List$map,
									function (_v2) {
										var fe = _v2.a;
										var bl = _v2.b;
										return _Utils_Tuple2(
											f(fe),
											bl);
									},
									lf),
								f(b));
						},
						lpc));
			case 'Var':
				var s = r.a;
				return _Utils_eq(s, sym) ? x : $author$project$MicroAgda$Raw$Var(s);
			default:
				var r1 = r.a;
				var r2 = r.b;
				return A2(
					$author$project$MicroAgda$Raw$App,
					f(r1),
					f(r2));
		}
	});
var $author$project$MicroAgda$Raw$subst = F2(
	function (s, x) {
		return A2(
			$elm$core$Basics$composeR,
			$author$project$MicroAgda$Raw$renameAbs(
				$author$project$MicroAgda$Raw$freeVars(x)),
			A2($author$project$MicroAgda$Raw$substUnsafe, s, x));
	});
var $author$project$MicroAgda$Raw$toTailForm = function (r) {
	if (r.$ === 'App') {
		var x = r.a;
		var y = r.b;
		var _v1 = $author$project$MicroAgda$Raw$toTailForm(x);
		var h = _v1.a;
		var t = _v1.b;
		return _Utils_Tuple2(
			h,
			A2(
				$elm$core$List$append,
				t,
				_List_fromArray(
					[y])));
	} else {
		var x = r;
		return _Utils_Tuple2(x, _List_Nil);
	}
};
var $author$project$MicroAgda$Raw$whnfTF = function (tf) {
	whnfTF:
	while (true) {
		if ((tf.a.$ === 'Lam') && tf.b.b) {
			var _v1 = tf.a;
			var s = _v1.a;
			var r1 = _v1.b;
			var _v2 = tf.b;
			var r2 = _v2.a;
			var tl = _v2.b;
			var _v3 = $author$project$MicroAgda$Raw$cyclic$whnf()(
				A3($author$project$MicroAgda$Raw$subst, s, r2, r1));
			var h = _v3.a;
			var tl2 = _v3.b;
			var $temp$tf = _Utils_Tuple2(
				h,
				A2($elm$core$List$append, tl2, tl));
			tf = $temp$tf;
			continue whnfTF;
		} else {
			var x = tf;
			return x;
		}
	}
};
function $author$project$MicroAgda$Raw$cyclic$whnf() {
	return A2($elm$core$Basics$composeR, $author$project$MicroAgda$Raw$toTailForm, $author$project$MicroAgda$Raw$whnfTF);
}
try {
	var $author$project$MicroAgda$Raw$whnf = $author$project$MicroAgda$Raw$cyclic$whnf();
	$author$project$MicroAgda$Raw$cyclic$whnf = function () {
		return $author$project$MicroAgda$Raw$whnf;
	};
} catch ($) {
	throw 'Some top-level definitions from `MicroAgda.Raw` are causing infinite recursion:\n\n  ┌─────┐\n  │    whnf\n  │     ↓\n  │    whnfTF\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $author$project$MicroAgda$TypeChecker$afterScopeCheckTC = F3(
	function (c, ty, rr) {
		var _v5 = $author$project$MicroAgda$Raw$whnf(rr);
		switch (_v5.a.$) {
			case 'App':
				var _v10 = _v5.a;
				return $elm$core$Result$Err('Internal Error : Not a WHNF!');
			case 'Lam':
				if (_v5.b.b) {
					var _v6 = _v5.a;
					var _v7 = _v5.b;
					return $elm$core$Result$Err('Internal Error : Not a WHNF!');
				} else {
					var _v11 = _v5.a;
					var s = _v11.a;
					var bo = _v11.b;
					return A2(
						$elm$core$Result$andThen,
						function (_v12) {
							var domD = _v12.a;
							var bodD = _v12.b;
							var cEx = A3(
								$author$project$MicroAgda$Internal$Ctx$extend,
								c,
								s,
								$author$project$MicroAgda$Internal$Ctx$CT(domD.unDom));
							return A2(
								$elm$core$Result$andThen,
								function (tyTm) {
									return A2(
										$elm$core$Result$map,
										$author$project$MicroAgda$Internal$Term$mkLam(tyTm),
										A2(
											$elm$core$Result$map,
											A2(
												$author$project$MicroAgda$Internal$Term$mkAbs,
												s,
												$author$project$MicroAgda$Internal$Ctx$youngestSymbolId(cEx)),
											A3(
												$author$project$MicroAgda$TypeChecker$tC,
												cEx,
												$author$project$MicroAgda$Internal$Ctx$CT(tyTm),
												bo)));
								},
								A2(
									$author$project$MicroAgda$Internal$Term$absApply,
									bodD,
									A2(
										$author$project$MicroAgda$Internal$Term$Def,
										$author$project$MicroAgda$Internal$Term$FromContext(
											$author$project$MicroAgda$Internal$Ctx$youngestSymbolId(cEx)),
										_List_Nil)));
						},
						A2(
							$elm$core$Result$fromMaybe,
							A2($author$project$MicroAgda$TypeChecker$notPiMsg, c, ty) + (' ' + $author$project$MicroAgda$Raw$raw2String(
								A2($author$project$MicroAgda$Raw$Lam, s, bo))),
							$author$project$MicroAgda$Internal$Term$toPiData(
								$author$project$MicroAgda$Internal$Ctx$toTm(ty))));
				}
			case 'Pi':
				if (_v5.b.b) {
					var _v8 = _v5.a;
					var _v9 = _v5.b;
					return $elm$core$Result$Err('Bad application!');
				} else {
					var _v13 = _v5.a;
					var s = _v13.a;
					var d = _v13.b;
					var b = _v13.c;
					return A3(
						$author$project$MicroAgda$TypeChecker$checkAgainst,
						c,
						ty,
						A2(
							$elm$core$Result$map,
							function (x) {
								return A2(
									$elm$core$Tuple$pair,
									x,
									$author$project$MicroAgda$Internal$Ctx$CT($author$project$MicroAgda$Internal$Term$Star));
							},
							A2(
								$elm$core$Result$andThen,
								function (domCType) {
									var cEx = A3($author$project$MicroAgda$Internal$Ctx$extend, c, s, domCType);
									return A2(
										$elm$core$Result$map,
										A2(
											$elm$core$Basics$composeR,
											$author$project$MicroAgda$Internal$Ctx$toTm,
											A2(
												$elm$core$Basics$composeR,
												A2(
													$author$project$MicroAgda$Internal$Term$mkAbs,
													s,
													$author$project$MicroAgda$Internal$Ctx$youngestSymbolId(cEx)),
												$author$project$MicroAgda$Internal$Term$mkPi(
													$author$project$MicroAgda$Internal$Ctx$toTm(domCType)))),
										A2($author$project$MicroAgda$TypeChecker$tYtC, cEx, b));
								},
								A2($author$project$MicroAgda$TypeChecker$afterScopeCheckTyTC, c, d))));
				}
			case 'LamP':
				var lpc = _v5.a.a;
				var ts = _v5.b;
				var agnst = $elm$core$List$isEmpty(ts) ? A2(
					$elm$core$Result$map,
					$author$project$MicroAgda$Internal$Ctx$CT,
					A2(
						$elm$core$Result$fromMaybe,
						A2($author$project$MicroAgda$TypeChecker$notPartialMsg, c, ty) + (' \n\n while trying to TC:\n' + $author$project$MicroAgda$Raw$raw2String(rr)),
						$author$project$MicroAgda$Internal$Term$toPartialDom(
							$author$project$MicroAgda$Internal$Ctx$toTm(ty)))) : (($elm$core$List$length(ts) > 1) ? $elm$core$Result$Err('not implemented (long ts)') : $elm$core$Result$Ok(ty));
				return A2(
					$elm$core$Result$andThen,
					function (_v14) {
						var pTm = _v14.a;
						var phiTm = _v14.b;
						var _v15 = $elm$core$List$head(ts);
						if (_v15.$ === 'Just') {
							var is1 = _v15.a;
							return A2(
								$elm$core$Result$andThen,
								$author$project$MicroAgda$Internal$Term$mkApp(pTm),
								A3($author$project$MicroAgda$TypeChecker$checkAgainstIsOne, c, phiTm, is1));
						} else {
							var _v16 = $author$project$MicroAgda$Internal$Term$toPartialPhi(
								$author$project$MicroAgda$Internal$Ctx$toTm(ty));
							if (_v16.$ === 'Nothing') {
								return $elm$core$Result$Err('internal error TC partial, imposible');
							} else {
								var phiTm2 = _v16.a;
								return A2($author$project$MicroAgda$Internal$Term$betaEq, phiTm2, phiTm) ? $elm$core$Result$Ok(pTm) : $elm$core$Result$Err(
									A3(
										$author$project$MicroAgda$TypeChecker$notEqMsg,
										c,
										$author$project$MicroAgda$Internal$Ctx$CT(phiTm2),
										$author$project$MicroAgda$Internal$Ctx$CT(phiTm)));
							}
						}
					},
					A2(
						$elm$core$Result$andThen,
						function (ag) {
							return A4(
								$author$project$MicroAgda$TypeChecker$lamPTC,
								c,
								ag,
								lpc,
								A2($elm$core$List$drop, 1, ts));
						},
						agnst));
			default:
				var s = _v5.a.a;
				var ts = _v5.b;
				return A3(
					$author$project$MicroAgda$TypeChecker$checkAgainst,
					c,
					ty,
					A3(
						$author$project$MicroAgda$TypeChecker$thenResultFold,
						$author$project$MicroAgda$TypeChecker$afterScopeCheckTCapp(c),
						ts,
						A3($author$project$MicroAgda$TypeChecker$lookInCtx, 'Internal Error : undefiend after scope check!', c, s)));
		}
	});
var $author$project$MicroAgda$TypeChecker$afterScopeCheckTCapp = F3(
	function (c, r, tt) {
		return A2(
			$elm$core$Result$andThen,
			function (_v3) {
				var tm = _v3.a;
				var _v4 = _v3.b;
				var dd = _v4.a;
				var bd = _v4.b;
				var appFn = A2(
					$elm$core$Maybe$withDefault,
					$author$project$MicroAgda$Internal$Term$mkApp,
					A2(
						$elm$core$Maybe$map,
						$author$project$MicroAgda$Internal$Term$mkPathApp,
						$author$project$MicroAgda$Internal$Term$toPathData(
							$author$project$MicroAgda$Internal$Ctx$toTm(tt.b))));
				return A2(
					$elm$core$Result$andThen,
					A2(
						$elm$core$Basics$composeR,
						$author$project$MicroAgda$TypeChecker$tupleMapBoth2(
							_Utils_Tuple2(
								appFn(tm),
								$author$project$MicroAgda$Internal$Term$piApp(
									_Utils_Tuple2(dd, bd)))),
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Tuple$mapSecond(
								$elm$core$Result$map($author$project$MicroAgda$Internal$Ctx$CT)),
							$author$project$MicroAgda$TypeChecker$resTuple)),
					A3(
						$author$project$MicroAgda$TypeChecker$afterScopeCheckTC,
						c,
						$author$project$MicroAgda$Internal$Ctx$CT(dd.unDom),
						r));
			},
			A2(
				$author$project$MicroAgda$TypeChecker$checkIfPi,
				'Not a Function Type',
				$elm$core$Result$Ok(tt)));
	});
var $author$project$MicroAgda$TypeChecker$afterScopeCheckTyTC = function (c) {
	return A2(
		$elm$core$Basics$composeR,
		A2(
			$author$project$MicroAgda$TypeChecker$afterScopeCheckTC,
			c,
			$author$project$MicroAgda$Internal$Ctx$CT($author$project$MicroAgda$Internal$Term$Star)),
		$elm$core$Result$map($author$project$MicroAgda$Internal$Ctx$CT));
};
var $author$project$MicroAgda$TypeChecker$checkAgainstInterval = F2(
	function (c, r) {
		return A3(
			$author$project$MicroAgda$TypeChecker$afterScopeCheckTC,
			c,
			$author$project$MicroAgda$Internal$Ctx$CT(
				$author$project$MicroAgda$Internal$Term$buildIn($author$project$MicroAgda$Internal$Term$Interval)),
			r);
	});
var $author$project$MicroAgda$TypeChecker$checkAgainstIsOne = F3(
	function (c, phi, r) {
		return A2(
			$elm$core$Result$andThen,
			function (tyTm) {
				return A3(
					$author$project$MicroAgda$TypeChecker$afterScopeCheckTC,
					c,
					$author$project$MicroAgda$Internal$Ctx$CT(tyTm),
					r);
			},
			A2(
				$author$project$MicroAgda$Internal$Term$mkApp,
				$author$project$MicroAgda$Internal$Term$buildIn($author$project$MicroAgda$Internal$Term$IsOne),
				phi));
	});
var $author$project$MicroAgda$TypeChecker$lamPTC = F4(
	function (c, ty, lpc, ts) {
		return $elm$core$List$isEmpty(ts) ? A2(
			$elm$core$Result$map,
			function (q) {
				return _Utils_Tuple2(
					A2(
						$author$project$MicroAgda$Internal$Term$LamP,
						$author$project$MicroAgda$Internal$Term$partialCases(q),
						_List_Nil),
					$author$project$MicroAgda$Internal$Term$collectPartialPhi(q));
			},
			A2(
				$elm$core$Result$map,
				$elm$core$List$concat,
				A2(
					$author$project$ResultExtra$mapListResult,
					A3($author$project$MicroAgda$TypeChecker$lamPTCcase, c, ty, ts),
					lpc))) : $elm$core$Result$Err('not implemented lamPTC');
	});
var $author$project$MicroAgda$TypeChecker$lamPTCcase = F4(
	function (c, ty, ts, _v1) {
		var rf = _v1.a;
		var rb = _v1.b;
		return $elm$core$List$isEmpty(ts) ? A2(
			$elm$core$Result$andThen,
			$author$project$ResultExtra$mapListResult(
				function (sf) {
					return A2(
						$elm$core$Result$andThen,
						$author$project$ResultExtra$thenPairResult(
							function (_v2) {
								var c2 = _v2.a;
								var tyTm2 = _v2.b;
								return function (rb2) {
									return A2(
										$elm$core$Result$mapError,
										function (s) {
											return 'while checking partial case ' + s;
										},
										A2(
											$elm$core$Result$map,
											$author$project$MicroAgda$Internal$Term$partialCase(sf),
											A3(
												$author$project$MicroAgda$TypeChecker$afterScopeCheckTC,
												c2,
												$author$project$MicroAgda$Internal$Ctx$CT(tyTm2),
												rb2)));
								};
							}),
						A2(
							$elm$core$Result$map,
							function (q) {
								return _Utils_Tuple2(
									A2(
										$author$project$MicroAgda$TypeChecker$substOnFace,
										_Utils_Tuple2(
											c,
											$author$project$MicroAgda$Internal$Ctx$toTm(ty)),
										q),
									$elm$core$Result$Ok(rb));
							},
							A2($author$project$MicroAgda$TypeChecker$substList, c, sf)));
				}),
			A2($author$project$MicroAgda$TypeChecker$rawFaceHandle, c, rf)) : $elm$core$Result$Err('not implemented lamPTcase');
	});
var $author$project$MicroAgda$TypeChecker$rawFaceHandle = F2(
	function (c, l) {
		return A2(
			$elm$core$Result$map,
			$author$project$MicroAgda$Internal$Term$subFace,
			A2(
				$elm$core$Result$map,
				A2(
					$elm$core$List$foldr,
					$author$project$MicroAgda$Internal$Term$mkMin,
					$author$project$MicroAgda$Internal$Term$buildIn($author$project$MicroAgda$Internal$Term$I1)),
				A2(
					$author$project$ResultExtra$mapListResult,
					function (_v0) {
						var r = _v0.a;
						var b = _v0.b;
						return A2(
							$elm$core$Result$map,
							function (iTm) {
								return b ? iTm : $author$project$MicroAgda$Internal$Term$mkNeg(iTm);
							},
							A2($author$project$MicroAgda$TypeChecker$checkAgainstInterval, c, r));
					},
					l)));
	});
var $author$project$MicroAgda$TypeChecker$tC = F2(
	function (c, ty) {
		return A2(
			$elm$core$Basics$composeR,
			$author$project$MicroAgda$TypeChecker$scopeCheck(c),
			$elm$core$Result$andThen(
				A2($author$project$MicroAgda$TypeChecker$afterScopeCheckTC, c, ty)));
	});
var $author$project$MicroAgda$TypeChecker$tYtC = function (c) {
	return A2(
		$elm$core$Basics$composeR,
		A2($author$project$MicroAgda$TypeChecker$tC, c, $author$project$MicroAgda$TypeChecker$ctUniv),
		$elm$core$Result$map($author$project$MicroAgda$Internal$Ctx$CT));
};
var $author$project$MicroAgda$TypeChecker$telescope = F3(
	function (e, c0, cty0) {
		return A2(
			$elm$core$List$foldl,
			function (s) {
				return A2(
					$elm$core$Basics$composeR,
					$author$project$MicroAgda$TypeChecker$checkIfPi(e),
					$elm$core$Result$andThen(
						function (_v0) {
							var c = _v0.a;
							var _v1 = _v0.b;
							var _do = _v1.a;
							var bo = _v1.b;
							return A2(
								$elm$core$Result$map,
								function (nTY) {
									return _Utils_Tuple2(
										A3(
											$author$project$MicroAgda$Internal$Ctx$extend,
											c,
											s,
											$author$project$MicroAgda$Internal$Ctx$CT(_do.unDom)),
										$author$project$MicroAgda$Internal$Ctx$CT(nTY));
								},
								A2(
									$author$project$MicroAgda$Internal$Term$absApply,
									bo,
									A2(
										$author$project$MicroAgda$Internal$Term$Def,
										$author$project$MicroAgda$Internal$Term$FromContext(
											$author$project$MicroAgda$Internal$Ctx$youngestSymbolId(c) + 1),
										_List_Nil)));
						}));
			},
			$elm$core$Result$Ok(
				_Utils_Tuple2(c0, cty0)));
	});
var $author$project$MicroAgda$File$tcDefinition = F2(
	function (c, _v0) {
		var pd = _v0.a;
		var failMap = $author$project$MicroAgda$File$defMap(
			function (_v16) {
				var _v17 = _v16.a;
				var _v18 = _v17.a;
				var a1 = _v18.a;
				var a2 = _v18.b;
				var _v19 = _v17.b;
				var a3 = _v19.a;
				var a4 = _v19.b;
				var a5 = _v16.b;
				var a6 = _v16.c;
				return _Utils_Tuple3(
					_Utils_Tuple2(
						_Utils_Tuple3(a1, a2, $elm$core$Maybe$Nothing),
						_Utils_Tuple3(a3, a4, $elm$core$Maybe$Nothing)),
					A2(
						$elm$core$List$map,
						function (x) {
							return x;
						},
						a5),
					_Utils_Tuple2($elm$core$Maybe$Nothing, a6));
			});
		var failMap2 = $author$project$MicroAgda$File$defMap(
			function (_v11) {
				var _v12 = _v11.a;
				var _v13 = _v12.a;
				var a1 = _v13.a;
				var a2 = _v13.b;
				var aa2 = _v13.c;
				var _v14 = _v12.b;
				var a3 = _v14.a;
				var a4 = _v14.b;
				var aa4 = _v14.c;
				var a5 = _v11.b;
				var _v15 = _v11.c;
				var a6a = _v15.a;
				var a6 = _v15.b;
				return _Utils_Tuple3(
					_Utils_Tuple2(
						_Utils_Tuple3(
							a1,
							a2,
							$elm$core$Maybe$Just(
								$elm$core$Result$Ok(aa2))),
						_Utils_Tuple3(
							a3,
							a4,
							$elm$core$Maybe$Just(
								$elm$core$Result$Ok(aa4)))),
					A2(
						$elm$core$List$map,
						function (x) {
							return x;
						},
						a5),
					_Utils_Tuple2(
						$elm$core$Maybe$Just(a6a),
						a6));
			});
		var sigTypeFail = function (s) {
			return A2(
				$author$project$MicroAgda$File$defHeadMap,
				function (_v7) {
					var _v8 = _v7.a;
					var _v9 = _v8.a;
					var a1 = _v9.a;
					var a2 = _v9.b;
					var bb = _v9.c;
					var _v10 = _v8.b;
					var a3 = _v10.a;
					var a4 = _v10.b;
					var cc = _v10.c;
					var a5 = _v7.b;
					var a6 = _v7.c;
					return _Utils_Tuple3(
						_Utils_Tuple2(
							_Utils_Tuple3(
								a1,
								a2,
								$elm$core$Maybe$Just(
									$elm$core$Result$Err('while checking ' + (pd.name + (' signature: ' + s))))),
							_Utils_Tuple3(a3, a4, cc)),
						a5,
						a6);
				},
				failMap(
					$author$project$MicroAgda$File$Definition(pd)));
		};
		var bodyTypeFail = function (sTm) {
			return function (s) {
				return A2(
					$author$project$MicroAgda$File$defHeadMap,
					function (_v3) {
						var _v4 = _v3.a;
						var _v5 = _v4.a;
						var a1 = _v5.a;
						var a2 = _v5.b;
						var bb = _v5.c;
						var _v6 = _v4.b;
						var a3 = _v6.a;
						var a4 = _v6.b;
						var cc = _v6.c;
						var a5 = _v3.b;
						var a6 = _v3.c;
						return _Utils_Tuple3(
							_Utils_Tuple2(
								_Utils_Tuple3(
									a1,
									a2,
									$elm$core$Maybe$Just(
										$elm$core$Result$Ok(
											$author$project$MicroAgda$Internal$Ctx$toTm(sTm)))),
								_Utils_Tuple3(
									a3,
									a4,
									$elm$core$Maybe$Just(
										$elm$core$Result$Err('while checking ' + (pd.name + (' body not mach sig: ' + s)))))),
							a5,
							a6);
					},
					failMap(
						$author$project$MicroAgda$File$Definition(pd)));
			};
		};
		return A2(
			$elm$core$Result$andThen,
			function (sigTC) {
				return A2(
					$elm$core$Result$andThen,
					function (_v1) {
						var ctx = _v1.a;
						var sTy = _v1.b;
						return A2(
							$elm$core$Result$andThen,
							function (_v2) {
								var cc = _v2.a;
								var goods = _v2.b;
								return A2(
									$elm$core$Result$map,
									function (boTm) {
										return $author$project$MicroAgda$File$Definition(
											{
												args: pd.args,
												body: _Utils_Tuple3(pd.body.a, pd.body.b, boTm),
												data: _Utils_Tuple2(ctx, pd.data),
												name: pd.name,
												signature: _Utils_Tuple3(
													pd.signature.a,
													pd.signature.b,
													$author$project$MicroAgda$Internal$Ctx$toTm(sigTC)),
												sub: goods
											});
									},
									A2(
										$elm$core$Result$mapError,
										bodyTypeFail(sTy),
										A3($author$project$MicroAgda$TypeChecker$tC, cc, sTy, pd.body.b)));
							},
							A2(
								$elm$core$Result$mapError,
								function (bads) {
									return $author$project$MicroAgda$File$Definition(
										{
											args: pd.args,
											body: _Utils_Tuple3(pd.body.a, pd.body.b, $elm$core$Maybe$Nothing),
											data: _Utils_Tuple2($elm$core$Maybe$Nothing, pd.data),
											name: pd.name,
											signature: _Utils_Tuple3(
												pd.signature.a,
												pd.signature.b,
												$elm$core$Maybe$Just(
													$elm$core$Result$Ok(
														$author$project$MicroAgda$Internal$Ctx$toTm(sigTC)))),
											sub: bads
										});
								},
								A6($author$project$ResultExtra$mapFoldSafe, $author$project$MicroAgda$File$tcDefinition, failMap, failMap2, $author$project$MicroAgda$File$defineByDef, ctx, pd.sub)));
					},
					A2(
						$elm$core$Result$mapError,
						sigTypeFail,
						A4($author$project$MicroAgda$TypeChecker$telescope, 'not a Pi in tele', c, sigTC, pd.args)));
			},
			A2(
				$elm$core$Result$mapError,
				sigTypeFail,
				A2($author$project$MicroAgda$TypeChecker$tYtC, c, pd.signature.b)));
	});
var $author$project$ResultExtra$tryResultArr = function (l) {
	return A2(
		$elm$core$Result$mapError,
		function (_v0) {
			return l;
		},
		A2($author$project$ResultExtra$mapListResult, $elm$core$Basics$identity, l));
};
var $author$project$MicroAgda$File$tcDefsList = function (c) {
	var failMap = $author$project$MicroAgda$File$defMap(
		function (_v10) {
			var _v11 = _v10.a;
			var _v12 = _v11.a;
			var a1 = _v12.a;
			var a2 = _v12.b;
			var _v13 = _v11.b;
			var a3 = _v13.a;
			var a4 = _v13.b;
			var a5 = _v10.b;
			var a6 = _v10.c;
			return _Utils_Tuple3(
				_Utils_Tuple2(
					_Utils_Tuple3(a1, a2, $elm$core$Maybe$Nothing),
					_Utils_Tuple3(a3, a4, $elm$core$Maybe$Nothing)),
				A2(
					$elm$core$List$map,
					function (x) {
						return x;
					},
					a5),
				_Utils_Tuple2($elm$core$Maybe$Nothing, a6));
		});
	var failMap1 = $author$project$MicroAgda$File$defMap(
		function (_v6) {
			var _v7 = _v6.a;
			var _v8 = _v7.a;
			var a1 = _v8.a;
			var a2 = _v8.b;
			var _v9 = _v7.b;
			var a3 = _v9.a;
			var a4 = _v9.b;
			var a5 = _v6.b;
			var a6 = _v6.c;
			return _Utils_Tuple3(
				_Utils_Tuple2(
					_Utils_Tuple2(
						a1,
						$elm$core$Result$Ok(a2)),
					_Utils_Tuple2(
						a3,
						$elm$core$Result$Ok(a4))),
				A2(
					$elm$core$List$map,
					function (x) {
						return x;
					},
					a5),
				a6);
		});
	var failMap2 = $author$project$MicroAgda$File$defMap(
		function (_v1) {
			var _v2 = _v1.a;
			var _v3 = _v2.a;
			var a1 = _v3.a;
			var a2 = _v3.b;
			var aa2 = _v3.c;
			var _v4 = _v2.b;
			var a3 = _v4.a;
			var a4 = _v4.b;
			var aa4 = _v4.c;
			var a5 = _v1.b;
			var _v5 = _v1.c;
			var a6a = _v5.a;
			var a6 = _v5.b;
			return _Utils_Tuple3(
				_Utils_Tuple2(
					_Utils_Tuple3(
						a1,
						a2,
						$elm$core$Maybe$Just(
							$elm$core$Result$Ok(aa2))),
					_Utils_Tuple3(
						a3,
						a4,
						$elm$core$Maybe$Just(
							$elm$core$Result$Ok(aa4)))),
				A2(
					$elm$core$List$map,
					function (x) {
						return x;
					},
					a5),
				_Utils_Tuple2(
					$elm$core$Maybe$Just(a6a),
					a6));
		});
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$List$map($author$project$MicroAgda$File$parseDefinition),
		A2(
			$elm$core$Basics$composeR,
			$author$project$ResultExtra$tryResultArr,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Result$mapError(
					A2(
						$elm$core$Basics$composeR,
						$elm$core$List$map(
							A2($author$project$ResultExtra$convergeResult, $elm$core$Basics$identity, failMap1)),
						$elm$core$List$map(
							A2($elm$core$Basics$composeR, $elm$core$Result$Err, $elm$core$Result$Err)))),
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Result$andThen(
						A2(
							$elm$core$Basics$composeR,
							A5($author$project$ResultExtra$mapFoldSafe, $author$project$MicroAgda$File$tcDefinition, failMap, failMap2, $author$project$MicroAgda$File$defineByDef, $author$project$MicroAgda$Internal$Ctx$emptyCtx),
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Result$map(
									function (_v0) {
										var a = _v0.a;
										var b = _v0.b;
										return _Utils_Tuple2(
											A2($elm$core$List$map, $elm$core$Result$Ok, b),
											a);
									}),
								$elm$core$Result$mapError(
									$elm$core$List$map(
										A2($elm$core$Basics$composeR, $elm$core$Result$Ok, $elm$core$Result$Err)))))),
					$author$project$ResultExtra$extractOptionalResult))));
};
var $author$project$MicroAgda$File$readFile = function (_v0) {
	var name = _v0.a;
	var upf = _v0.b;
	var _v1 = A2($author$project$MicroAgda$File$tcDefsList, $author$project$MicroAgda$Internal$Ctx$emptyCtx, upf);
	var mds = _v1.a;
	var mbC = _v1.b;
	return _Utils_Tuple2(
		A2($author$project$MicroAgda$File$File, name, mds),
		mbC);
};
var $author$project$MicroAgda$File$UnParsedFile = F2(
	function (a, b) {
		return {$: 'UnParsedFile', a: a, b: b};
	});
var $author$project$MicroAgda$Internal$Translate$t2str = function (c) {
	return A2(
		$elm$core$Basics$composeR,
		A2($author$project$MicroAgda$Internal$Translate$internal2raw, c, _List_Nil),
		$author$project$MicroAgda$Raw$raw2String);
};
var $author$project$MicroAgda$Internal$Translate$t2strNoCtx = $author$project$MicroAgda$Internal$Translate$t2str($author$project$MicroAgda$Internal$Ctx$emptyCtx);
var $author$project$MicroAgda$File$upc = F5(
	function (a, b, c, d, e) {
		return $author$project$MicroAgda$File$Definition(
			{args: c, body: d, data: _Utils_Tuple0, name: a, signature: b, sub: e});
	});
var $author$project$MicroAgda$BuildInFile$buildInFileCheck = A2(
	$author$project$MicroAgda$File$UnParsedFile,
	'buildInFileTypes',
	A2(
		$elm$core$List$map,
		function (_v0) {
			var nam = _v0.a;
			var ob = _v0.b;
			return A5(
				$author$project$MicroAgda$File$upc,
				nam + 'Test',
				$author$project$MicroAgda$Internal$Translate$t2strNoCtx(ob.ty),
				_List_Nil,
				nam,
				_List_Nil);
		},
		$author$project$MicroAgda$Internal$Term$buildInTokensList));
var $author$project$MicroAgda$File$mkFile = $author$project$MicroAgda$File$UnParsedFile;
var $author$project$MicroAgda$SampleFiles$Assoc$content = A2(
	$author$project$MicroAgda$File$mkFile,
	'assoc',
	_List_fromArray(
		[
			A5(
			$author$project$MicroAgda$File$upc,
			'hfill',
			'\n∀ ( l : Level ) → ∀ ( A : Type l) \n        → ∀ (φ : I)\n        → ∀ (u : ∀ ( i : I) → Partial l φ A)\n        → ∀ (u0 : Sub l A φ (u i0))\n        → ∀ (i : I) → A\n',
			_List_fromArray(
				['ll', 'B', 'φ', 'u', 'u0', 'i']),
			'\nhcomp ll B (φ ∨ ~ i) ( λ k → λ { (φ = i1) → u (i ∧ k) 1=1 ; (i = i0) → outS ll B φ (u i0) u0 } ) \n                                   (outS ll B φ (u i0) u0)\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'Path',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → A → A → Type l\n',
			_List_fromArray(
				['l', 'A', 'x', 'y']),
			'PathP l (λ q → A) x y\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'compPath-filler',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → I → I → A\n',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'p', 'q']),
			'\nλ j → λ i → hfill l A (~ i ∨ i) (λ j → λ { (i = i0) → x\n                   ; (i = i1) → q j }) (inS l A (~ i ∨ i) (p i)) j\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'compPath',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → Path l A x z\n',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'p', 'q', 'j']),
			'\ncompPath-filler l A x y z p q i1 j\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'compPath\'-filler',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → I → I → A\n',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'p', 'q', 'j', 'i']),
			'\nhfill l A (~ i ∨ i) (λ j → λ { (i = i0) → p (~ j)\n                   ; (i = i1) → z }) (inS l A (~ i ∨ i) (q i)) j\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'compPath\'',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → Path l A x z\n',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'p', 'q', 'j']),
			'\ncompPath\'-filler l A x y z p q i1 j\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'3outof4-filler',
			'\n∀ (l : Level) → ∀ (A : Type l) → ∀ (α : I → I → A) → ∀ (p : Path l A (α i1 i0) (α i1 i1))\n  → ∀ (β : PathP l (λ j → Path l A (α j i0) (α j i1)) (λ i → α i0 i) p) → I → I → I → A\n    ',
			_List_fromArray(
				['l', 'A', 'α', 'p', 'β', 'k', 'j', 'i']),
			'\nhfill l A (~ i ∨ i ∨ ~ j ∨ j)\n         (λ ii → λ { (i = i0) → α ii i0\n                  ; (i = i1) → α ii i1\n                  ; (j = i0) → α ii i\n                  ; (j = i1) → β ii i\n                  }) (inS l A (~ i ∨ i ∨ ~ j ∨ j) (α i0 i)) k\n    ',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'3outof4',
			'\n∀ (l : Level) → ∀ (A : Type l) → ∀ (α : I → I → A) → ∀ (p : Path l A (α i1 i0) (α i1 i1))\n  → ∀ (β : PathP l (λ j → Path l A (α j i0) (α j i1)) (λ i → α i0 i) p)\n → Path l (Path l A (α i1 i0) (α i1 i1)) (λ i → α i1 i) p\n    ',
			_List_fromArray(
				['l', 'A', 'α', 'p', 'β', 'j', 'i']),
			'\n3outof4-filler l A α p β i1 j i\n    ',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'preassoc-filler',
			'\n∀ (l : Level) → ∀ (A : Type l) → ∀ (x y z w : A)\n→ ∀ (p : Path l A x y) → ∀ (q : Path l A y z)\n→ ∀ (r : Path l A z w) → I → I → I → A\n    ',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'w', 'p', 'q', 'r', 'k', 'j', 'i']),
			'\n  hfill l A (~ i ∨ i ∨ ~ j) (λ kk → λ { (i = i0) → x\n                  ; (i = i1) → compPath-filler l A y z w q r kk j\n                  ; (j = i0) → p i\n                  }) (inS l A (~ i ∨ i ∨ ~ j) (compPath-filler l A x y z p q j i)) k\n    ',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'preassoc',
			'\n∀ (l : Level) → ∀ (A : Type l) → ∀ (x y z w : A)\n                   → ∀ (p : Path l A x y) → ∀ (q : Path l A y z)\n                   → ∀ (r : Path l A z w)\n                   → PathP l  (λ j → Path l A x ((compPath l A y z w q  r) j)) p\n                     (compPath l A x z w (compPath l A x y z p  q) r)  \n    ',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'w', 'p', 'q', 'r', 'j', 'i']),
			'\n preassoc-filler l A x y z w p q r i1 j i\n    ',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'assoc',
			'\n    ∀ (l : Level) → ∀ (A : Type l)\n            → ∀ (x y z w : A)\n            → ∀ (p : Path l A x y) → ∀ (q : Path l A y z)\n                       → ∀ (r : Path l A z w) →\n      Path l (Path l A x w)                  \n     (compPath l A x y w p (compPath l A y z w q r))\n     (compPath l A x z w (compPath l A x y z p  q) r)\n        ',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'w', 'p', 'q', 'r']),
			'\n    3outof4 l A\n      (compPath-filler l A x y w p (compPath l A y z w q r))\n      (compPath l A x z w (compPath l A x y z p q) r)\n      (preassoc l A x y z w  p q r)  \n    ',
			_List_Nil)
		]));
var $author$project$MicroAgda$SampleFiles$AssocAlt$content = A2(
	$author$project$MicroAgda$File$mkFile,
	'assocAlt',
	_List_fromArray(
		[
			A5(
			$author$project$MicroAgda$File$upc,
			'hfill',
			'\n∀ ( l : Level ) → ∀ ( A : Type l) \n        → ∀ (φ : I)\n        → ∀ (u : ∀ ( i : I) → Partial l φ A)\n        → ∀ (u0 : Sub l A φ (u i0))\n        → ∀ (i : I) → A\n',
			_List_fromArray(
				['ll', 'B', 'φ', 'u', 'u0', 'i']),
			'\nhcomp ll B (φ ∨ ~ i) ( λ k → λ { (φ = i1) → u (i ∧ k) 1=1 ; (i = i0) → outS ll B φ (u i0) u0 } ) \n                                   (outS ll B φ (u i0) u0)\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'Path',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → A → A → Type l\n',
			_List_fromArray(
				['l', 'A', 'x', 'y']),
			'PathP l (λ q → A) x y\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'compPath-filler',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → I → I → A\n',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'p', 'q']),
			'\nλ j → λ i → hfill l A (~ i ∨ i) (λ k → λ { (i = i0) → x\n                   ; (i = i1) → q k }) (inS l A (~ i ∨ i) (p i)) j\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'compPath',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → Path l A x z\n',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'p', 'q', 'j']),
			'\ncompPath-filler l A x y z p q i1 j\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'compPath\'-filler',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → I → I → A\n',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'p', 'q', 'j', 'i']),
			'\nhfill l A (~ i ∨ i) (λ k → λ { (i = i0) → p (~ k)\n                   ; (i = i1) → z }) (inS l A (~ i ∨ i) (q i)) j\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'compPath\'',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → Path l A x z\n',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'p', 'q', 'j']),
			'\ncompPath\'-filler l A x y z p q i1 j\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'compPath-filler\'',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → I → I → A\n',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'p', 'q', 'j', 'i']),
			'\nhcomp l A (~ i ∨ i ∨ j) \n    (λ k → λ {\n        (i = i0) → p j\n      ; (i = i1) → q k\n      ; (j = i1) → q (i ∧ k)\n      })\n    (p (i ∨ j))\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'assoc\'',
			'\n    ∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z w : A) → \n    ∀ (p : Path l A x y) →  ∀ (q : Path l A y z) →  ∀ (r : Path l A z w)\n      → Path l (Path l A x w)\n      (compPath l A x y w p (compPath l A y z w q r)  )\n      (compPath l A x z w (compPath l A x y z p q) r)\n    ',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'w', 'p', 'q', 'r', 'm']),
			'\n    compPath l A \n      (compPath-filler l A x y z p q m i0)\n      (compPath-filler l A x y z p q m i1)\n      (compPath-filler\' l A y z w q r m i1)\n      (λ i → compPath-filler l A x y z p q m i)\n      (λ i → compPath-filler\' l A y z w q r m i) \n    ',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'compSq',
			'∀ (l : Level) → ∀ (A : Type l)\n        → ∀ (x y : A) \n        → ∀ (p q r : Path l A x y)\n        → ∀ (pq : Path l (Path l A x y) p q)\n        → ∀ (qr : Path l (Path l A x y) q r)\n        → Path l (Path l A x y) p r\n    ',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'p', 'q', 'r', 'pq', 'qr', 'i', 'j']),
			'\n       hcomp l A (i ∨ ~ i ∨ j ∨ ~ j) (λ k → λ {\n          (i = i0) → p j\n        ; (i = i1) → (qr k j)\n        ; (j = i0) → x\n        ; (j = i1) → (y)\n         }) (pq i j)\n       ',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'compSq\'',
			'∀ (l : Level) → ∀ (A : Type l)\n        → ∀ (x y : A) \n        → ∀ (p q r s : Path l A x y)\n        → ∀ (pq : Path l (Path l A x y) p q)\n        → ∀ (qr : Path l (Path l A x y) q r)\n        → ∀ (rs : Path l (Path l A x y) r s)\n        → Path l (Path l A x y) p s\n    ',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'p', 'q', 'r', 's', 'pq', 'qr', 'rs', 'i', 'j']),
			'\n       hcomp l A (i ∨ ~ i ∨ j ∨ ~ j) (λ k → λ {\n          (i = i0) → pq (~ k) j\n        ; (i = i1) → (rs k j)\n        ; (j = i0) → x\n        ; (j = i1) → y\n         }) (qr i j)\n       ',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'congPa',
			'∀ (l : Level) → ∀ (A : Type l)\n             → ∀ (x y z : A)\n             → ∀ (yz : Path l A y z)\n             → ∀ (p q : Path l A x y)\n             → ∀ (pq : Path l (Path l A x y) p q)\n             → Path l (Path l A x z)\n             (compPath l A x y z p yz)\n             (compPath l A x y z q yz)',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'yz', 'p', 'q', 'pq', 'i']),
			'compPath l A x y z (pq i) yz',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'congPa2',
			'∀ (l : Level) → ∀ (A : Type l)\n        → ∀ (x y z : A)\n        → ∀ (xy : Path l A x y)\n        → ∀ (p q : Path l A y z)\n        → ∀ (pq : Path l (Path l A y z) p q)\n        → Path l (Path l A x z)\n        (compPath l A x y z xy p)\n        (compPath l A x y z xy q)',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'yz', 'p', 'q', 'pq', 'i']),
			'compPath l A x y z yz (pq i)',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'pentA',
			'\n    ∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z w v : A) → \n    ∀ (p : Path l A x y) →  ∀ (q : Path l A y z) →  ∀ (r : Path l A z w) →  ∀ (s : Path l A w v)\n      → I → I → A\n    ',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'w', 'v', 'p', 'q', 'r', 's']),
			'\n  compSq l A x v\n  (compPath l A x y v p\n    (compPath l A y z v q (compPath l A z w v r s)))\n  (compPath l A x z v (compPath l A x y z p q)\n    (compPath l A z w v r s))\n  (compPath l A x w v (compPath l A x z w (compPath l A x y z p q) r)\n    s)\n  (assoc\' l A x y z v p q (compPath l A z w v r s))\n  (assoc\' l A x z w v (compPath l A x y z p q) r s)\n    ',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'pentB',
			'\n    ∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z w v : A) → \n    ∀ (p : Path l A x y) →  ∀ (q : Path l A y z) →  ∀ (r : Path l A z w) →  ∀ (s : Path l A w v)\n      → I → I → A\n    ',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'w', 'v', 'p', 'q', 'r', 's']),
			'\n        compSq l A x v (compPath l A x y v p\n                         (compPath l A y z v q (compPath l A z w v r s))) (compPath l A x w v (compPath l A x y w p (compPath l A y z w q r))\n                                                                            s) (compPath l A x w v (compPath l A x z w (compPath l A x y z p q) r)\n                                                                                 s)\n        (compSq l A x v (compPath l A x y v p\n                                (compPath l A y z v q (compPath l A z w v r s))) (compPath l A x y v p\n                                     (compPath l A y w v (compPath l A y z w q r) s)) (compPath l A x w v (compPath l A x y w p (compPath l A y z w q r))\n                                          s)\n        (congPa2 l A x y v p (compPath l A y z v q (compPath l A z w v r s))\n        (compPath l A y w v (compPath l A y z w q r) s)\n          (assoc\' l A y z w v q r s))\n        (assoc\' l A x y w v p (compPath l A y z w q r) s))\n        (congPa l A x w v s (compPath l A x y w p (compPath l A y z w q r))\n        (compPath l A x z w (compPath l A x y z p q) r)\n        (assoc\' l A x y z w p q r))',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'pentB\'',
			'\n    ∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z w v : A) → \n    ∀ (p : Path l A x y) →  ∀ (q : Path l A y z) →  ∀ (r : Path l A z w) →  ∀ (s : Path l A w v)\n      → I → I → A\n    ',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'w', 'v', 'p', 'q', 'r', 's']),
			'\n  compSq\' l A x v\n\n  (compPath l A x y v p\n    (compPath l A y z v q (compPath l A z w v r s)))\n\n  (compPath l A x y v p\n    (compPath l A y w v (compPath l A y z w q r) s))\n\n  (compPath l A x w v (compPath l A x y w p (compPath l A y z w q r))\n    s)\n\n  (compPath l A x w v (compPath l A x z w (compPath l A x y z p q) r)\n    s)\n\n  (congPa2 l A x y v p (compPath l A y z v q (compPath l A z w v r s))\n  (compPath l A y w v (compPath l A y z w q r) s)\n    (assoc\' l A y z w v q r s))\n    \n  (assoc\' l A x y w v p (compPath l A y z w q r) s)\n\n  (congPa l A x w v s (compPath l A x y w p (compPath l A y z w q r))\n  (compPath l A x z w (compPath l A x y z p q) r)\n  (assoc\' l A x y z w p q r))',
			_List_Nil)
		]));
var $author$project$MicroAgda$SampleFiles$FaceTest$content = A2(
	$author$project$MicroAgda$File$mkFile,
	'faceTest',
	_List_fromArray(
		[
			A5(
			$author$project$MicroAgda$File$upc,
			'hfill',
			'\n∀ ( l : Level ) → ∀ ( A : Type l) \n        → ∀ (φ : I)\n        → ∀ (u : ∀ ( i : I) → Partial l φ A)\n        → ∀ (u0 : Sub l A φ (u i0))\n        → ∀ (i : I) → A\n',
			_List_fromArray(
				['ll', 'B', 'φ', 'u', 'u0', 'i']),
			'\nhcomp ll B (φ ∨ ~ i) ( λ k → λ { (φ = i1) → u (i ∧ k) 1=1 ; (i = i0) → outS ll B φ (u i0) u0 } ) \n                                   (outS ll B φ (u i0) u0)\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'Path',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → A → A → Type l\n',
			_List_fromArray(
				['l', 'A', 'x', 'y']),
			'PathP l (λ q → A) x y\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'compPath-filler',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → I → I → A\n',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'p', 'q']),
			'\nλ j → λ i → hfill l A (~ i ∨ i) (λ j → λ { (i = i0) → x\n                   ; (i = i1) → q j }) (inS l A (~ i ∨ i) (p i)) j\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'compPath',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → Path l A x z\n',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'p', 'q', 'j']),
			'\ncompPath-filler l A x y z p q i1 j\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'compPath\'-filler',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → I → I → A\n',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'p', 'q', 'j', 'i']),
			'\nhfill l A (~ i ∨ i) (λ j → λ { (i = i0) → p (~ j)\n                   ; (i = i1) → z }) (inS l A (~ i ∨ i) (q i)) j\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'compPath\'',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → Path l A x z\n',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'p', 'q', 'j']),
			'\ncompPath\'-filler l A x y z p q i1 j\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'3outof4-filler',
			'\n∀ (l : Level) → ∀ (A : Type l) → ∀ (α : I → I → A) → ∀ (p : Path l A (α i1 i0) (α i1 i1))\n  → ∀ (β : PathP l (λ j → Path l A (α j i0) (α j i1)) (λ i → α i0 i) p) → I → I → I → A\n    ',
			_List_fromArray(
				['l', 'A', 'α', 'p', 'β', 'k', 'j', 'i']),
			'\nhfill l A (~ i ∨ i ∨ ~ j ∨ j)\n         (λ ii → λ { (i = i0) → α ii i0\n                  ; (i = i1) → α ii i1\n                  ; (j = i0) → α ii i\n                  ; (j = i1) → β ii i\n                  }) (inS l A (~ i ∨ i ∨ ~ j ∨ j) (α i0 i)) k\n    ',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'3outof4',
			'\n∀ (l : Level) → ∀ (A : Type l) → ∀ (α : I → I → A) → ∀ (p : Path l A (α i1 i0) (α i1 i1))\n  → ∀ (β : PathP l (λ j → Path l A (α j i0) (α j i1)) (λ i → α i0 i) p)\n → Path l (Path l A (α i1 i0) (α i1 i1)) (λ i → α i1 i) p\n    ',
			_List_fromArray(
				['l', 'A', 'α', 'p', 'β', 'j', 'i']),
			'\n3outof4-filler l A α p β i1 j i\n    ',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'preassoc-filler',
			'\n∀ (l : Level) → ∀ (A : Type l) → ∀ (x y z w : A)\n→ ∀ (p : Path l A x y) → ∀ (q : Path l A y z)\n→ ∀ (r : Path l A z w) → I → I → I → A\n    ',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'w', 'p', 'q', 'r', 'k', 'j', 'i']),
			'\n  hfill l A (~ i ∨ i ∨ ~ j) (λ kk → λ { (i = i0) → x\n                  ; (i = i1) → compPath-filler l A y z w q r kk j\n                  ; (j = i0) → p i\n                  }) (inS l A (~ i ∨ i ∨ ~ j) (compPath-filler l A x y z p q j i)) k\n    ',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'preassoc',
			'\n∀ (l : Level) → ∀ (A : Type l) → ∀ (x y z w : A)\n                   → ∀ (p : Path l A x y) → ∀ (q : Path l A y z)\n                   → ∀ (r : Path l A z w)\n                   → PathP l  (λ j → Path l A x ((compPath l A y z w q  r) j)) p\n                     (compPath l A x z w (compPath l A x y z p  q) r)  \n    ',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'w', 'p', 'q', 'r', 'j', 'i']),
			'\n preassoc-filler l A x y z w p q r i1 j i\n    ',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'assoc22',
			'\n    ∀ (l : Level) → ∀ (A : Type l)\n            → ∀ (x y z w : A)\n            → ∀ (p : Path l A x y) → ∀ (q : Path l A y z)\n                       → ∀ (r : Path l A z w) →\n      Path l (Path l A x w)                  \n     (compPath l A x y w p (compPath l A y z w q r))\n     (compPath l A x z w (compPath l A x y z p  q) r)\n        ',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'w', 'p', 'q', 'r', 'i', 'j']),
			'\n    3outof4 l A\n      (compPath-filler l A x y w p (compPath l A y z w q r))\n      (compPath l A x z w (compPath l A x y z p q) r)\n      (preassoc l A x y z w  p q r) j (i)  \n    ',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'assoc',
			'\n    ∀ (l : Level) → ∀ (A : Type l)\n            → ∀ (x y z w : A)\n            → ∀ (p : Path l A x y) → ∀ (q : Path l A y z)\n                       → ∀ (r : Path l A z w) →\n      Path l (Path l A x w)                  \n     (compPath l A x y w p (compPath l A y z w q r))\n     (compPath l A x z w (compPath l A x y z p  q) r)\n        ',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'w', 'p', 'q', 'r']),
			'\n    3outof4 l A\n      (compPath-filler l A x y w p (compPath l A y z w q r))\n      (compPath l A x z w (compPath l A x y z p q) r)\n      (preassoc l A x y z w  p q r)  \n    ',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'ft1',
			'\n   ∀ (l : Level) → ∀ (A : Type l)\n        → ∀ (x y z w : A) \n        → ∀ (xy : Path l A x y)\n        → ∀ (xz : Path l A x z)\n        → ∀ (yw : Path l A y w)\n        → ∀ (zw : Path l A z w)\n        → ∀ (c : PathP l (λ j → (Path l A (xz j) (yw j))) xy zw)\n        → I →  A\n        ',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'w', 'xy', 'xz', 'yw', 'zw', 'c', 'i']),
			'\n      c i i\n    ',
			_List_Nil)
		]));
var $author$project$MicroAgda$SampleFiles$Prelude$content = A2(
	$author$project$MicroAgda$File$mkFile,
	'prelude',
	_List_fromArray(
		[
			A5(
			$author$project$MicroAgda$File$upc,
			'hfill',
			'\n∀ ( l : Level ) → ∀ ( A : Type l) \n        → ∀ (φ : I)\n        → ∀ (u : ∀ ( i : I) → Partial l φ A)\n        → ∀ (u0 : Sub l A φ (u i0))\n        → ∀ (i : I) → A\n',
			_List_fromArray(
				['ll', 'B', 'φ', 'u', 'u0', 'i']),
			'\nhcomp ll B (φ ∨ ~ i) ( λ k → λ { (φ = i1) → u (i ∧ k) 1=1 ; (i = i0) → outS ll B φ (u i0) u0 } ) \n                                   (outS ll B φ (u i0) u0)\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'Path',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → A → A → Type l\n',
			_List_fromArray(
				['l', 'A', 'x', 'y']),
			'PathP l (λ q → A) x y\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'compPath-filler',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → I → I → A\n',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'p', 'q']),
			'\nλ j → λ i → hfill l A (~ i ∨ i) (λ k → λ { (i = i0) → x\n                   ; (i = i1) → q k }) (inS l A (~ i ∨ i) (p i)) j\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'compPath',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → Path l A x z\n',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'p', 'q', 'j']),
			'\ncompPath-filler l A x y z p q i1 j\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'compPath\'-filler',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → I → I → A\n',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'p', 'q', 'j', 'i']),
			'\nhfill l A (~ i ∨ i) (λ k → λ { (i = i0) → p (~ k)\n                   ; (i = i1) → z }) (inS l A (~ i ∨ i) (q i)) j\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'compPath\'',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → Path l A x z\n',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'p', 'q', 'j']),
			'\ncompPath\'-filler l A x y z p q i1 j\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'comp=comp\'',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → \n∀ (p : Path l A x y) →  ∀ (q : Path l A y z) → Path l (Path l A x z) (compPath\' l A x y z  p q) (compPath l A x y z p q) ',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'p', 'q', 'i', 'j']),
			'hcomp l A (~ i ∨ i ∨ ~ j ∨ j) (λ k → λ { (i = i0) → compPath\'-filler l A x y z p q k j\n                                             ; (i = i1) → compPath-filler l A x y z p q k j\n                                             ; (j = i0) → p ( ~ i ∧ ~ k)\n                                             ; (j = i1) → q (k ∨ ~ i) }) (helper i j)',
			_List_fromArray(
				[
					A5(
					$author$project$MicroAgda$File$upc,
					'helper',
					'I → I → A',
					_List_fromArray(
						['ii', 'jj']),
					'hcomp l A (~ ii ∨ ii ∨ ~ jj ∨ jj) (λ kk → λ { (ii = i0) → q (kk ∧ jj)\n                                ; (ii = i1) → p (~ kk ∨ jj)\n                                ; (jj = i0) → p (~ ii ∨ ~ kk)\n                                ; (jj = i1) → q (~ ii ∧ kk) })\n                       y',
					_List_Nil)
				]))
		]));
var $author$project$MicroAgda$SampleFiles$Sample$content = A2(
	$author$project$MicroAgda$File$mkFile,
	'sample',
	_List_fromArray(
		[
			A5(
			$author$project$MicroAgda$File$upc,
			'hfill',
			'\n∀ ( l : Level ) → ∀ ( A : Type l) \n        → ∀ (φ : I)\n        → ∀ (u : ∀ ( i : I) → Partial l φ A)\n        → ∀ (u0 : Sub l A φ (u i0))\n        → ∀ (i : I) → A\n',
			_List_fromArray(
				['ll', 'B', 'φ', 'u', 'u0', 'i']),
			'\nhcomp ll B (φ ∨ ~ i) ( λ k → λ { (φ = i1) → u (i ∧ k) 1=1 ; (i = i0) → outS ll B φ (u i0) u0 } ) \n                                   (outS ll B φ (u i0) u0)\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'Path',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → A → A → Type l\n',
			_List_fromArray(
				['l', 'A', 'x', 'y']),
			'PathP l (λ q → A) x y\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'compPath-filler',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → I → I → A\n',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'p', 'q']),
			'\nλ j → λ i → hfill l A (~ i ∨ i) (λ k → λ { (i = i0) → x\n                   ; (i = i1) → q k }) (inS l A (~ i ∨ i) (p i)) j\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'compPath',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → Path l A x z\n',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'p', 'q', 'j']),
			'\ncompPath-filler l A x y z p q i1 j\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'compPath\'-filler',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → I → I → A\n',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'p', 'q', 'j', 'i']),
			'\nhfill l A (~ i ∨ i) (λ k → λ { (i = i0) → p (~ k)\n                   ; (i = i1) → z }) (inS l A (~ i ∨ i) (q i)) j\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'compPath\'',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → Path l A x z\n',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'p', 'q', 'j']),
			'\ncompPath\'-filler l A x y z p q i1 j\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'compPath-filler\'',
			'\n∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → I → I → A\n',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'p', 'q', 'j', 'i']),
			'\nhcomp l A (~ i ∨ i ∨ j) \n    (λ k → λ {\n        (i = i0) → p j\n      ; (i = i1) → q k\n      ; (j = i1) → q (i ∧ k)\n      })\n    (p (i ∨ j))\n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'assoc\'',
			'\n    ∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z w : A) → \n    ∀ (p : Path l A x y) →  ∀ (q : Path l A y z) →  ∀ (r : Path l A z w)\n      → Path l (Path l A x w)\n      (compPath l A x y w p (compPath l A y z w q r)  )\n      (compPath l A x z w (compPath l A x y z p q) r)\n    ',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'z', 'w', 'p', 'q', 'r', 'm']),
			'\n    compPath l A \n      (compPath-filler l A x y z p q m i0)\n      (compPath-filler l A x y z p q m i1)\n      (compPath-filler\' l A y z w q r m i1)\n      (λ i → compPath-filler l A x y z p q m i)\n      (λ i → compPath-filler\' l A y z w q r m i) \n    ',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'test3d',
			'\n    ∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y : A) → \n    ∀ (p : Path l A x y) → I → I → I → A\n    ',
			_List_fromArray(
				['l', 'A', 'x', 'y', 'p', 'i', 'j', 'k']),
			'\np (i ∨ j ∨ k)\n    ',
			_List_Nil)
		]));
var $author$project$MicroAgda$SampleFiles$Test1$content = A2(
	$author$project$MicroAgda$File$mkFile,
	'test1',
	_List_fromArray(
		[
			A5($author$project$MicroAgda$File$upc, 'hcomptest', '∀ (l : Level) → ∀ (A : Type l) → ∀ (φ : I) → ∀ (u : ∀ (ii : I) → Partial l φ A) → ∀ (u0 : A) → A', _List_Nil, 'hcomp', _List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'f1',
			'∀ (i : I) → ∀ (j : I) → ∀ (k : I) → I',
			_List_fromArray(
				['i', 'j', 'k']),
			'( k ∨ j ) ∨ (f11 k i)',
			_List_fromArray(
				[
					A5(
					$author$project$MicroAgda$File$upc,
					'f11',
					'∀ (ii : I) → ∀ (jj : I) → I',
					_List_fromArray(
						['iii', 'jjj']),
					'k ∨ jjj',
					_List_fromArray(
						[
							A5(
							$author$project$MicroAgda$File$upc,
							'f111',
							'∀ (ii : I) → ∀ (jj : I) → I',
							_List_fromArray(
								['iii', 'jjj']),
							'k ∨ jjj',
							_List_Nil),
							A5(
							$author$project$MicroAgda$File$upc,
							'f112',
							'∀ (ii : I) → ∀ (jj : I) → I',
							_List_fromArray(
								['iii', 'jjj']),
							'k ∨ jjj',
							_List_Nil)
						]))
				])),
			A5(
			$author$project$MicroAgda$File$upc,
			'intervalOps1',
			'∀ (i : I) → ∀ (j : I) → ∀ (k : I) → ∀ (l : I) → ∀ (m : I) → ∀ (n : I) → I',
			_List_fromArray(
				['i', 'j', 'k']),
			'λ l → (λ m → λ n → ( ( k ∨ j ) ∨ i ) ∧ ( ~ ( k ∨ ( ~ k ) ∨ k ∨ ( ( ~ m ) ∨ ( ~ ( ~ j ) ) ∧ n ) ∨ k ) ) ∧ ~ n)',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'intervalOps2',
			'∀ (i : I) → ∀ (j : I) → ∀ (k : I) → ∀ (l : I) → ∀ (m : I) → ∀ (n : I) → I',
			_List_fromArray(
				['i', 'j', 'k']),
			'λ l → λ m → λ n → f1 l m n ',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'betaTest',
			'∀ (l : Level) → ∀ (A B : Type l) → ∀ (f : A → B) → A → B',
			_List_fromArray(
				['l', 'A', 'B', 'f']),
			'λ x → f x',
			_List_Nil)
		]));
var $author$project$MicroAgda$SampleFiles$TestParseErr$content = A2(
	$author$project$MicroAgda$File$mkFile,
	'testParseErr',
	_List_fromArray(
		[
			A5(
			$author$project$MicroAgda$File$upc,
			'f1',
			'∀ (i : I) → ∀ (j : I) → qq∀ (k : I) → I',
			_List_fromArray(
				['i', 'j', 'k']),
			'( k ∨ j ) ∨ (f11)',
			_List_fromArray(
				[
					A5(
					$author$project$MicroAgda$File$upc,
					'f11',
					'∀ (ii : I) → ∀ (jj : I) → I',
					_List_fromArray(
						['iii', 'jjj']),
					'k ∨ jjj',
					_List_fromArray(
						[
							A5(
							$author$project$MicroAgda$File$upc,
							'f111',
							'∀z (i-i : I) → ∀ (jj : I) → I',
							_List_fromArray(
								['iii', 'jjj']),
							'k ∨ jjj',
							_List_Nil),
							A5(
							$author$project$MicroAgda$File$upc,
							'f112',
							'∀qq (ii : I) → ∀ (jj : I) → I',
							_List_fromArray(
								['iii', 'jjj']),
							'k ∨ jjj',
							_List_Nil)
						]))
				])),
			A5(
			$author$project$MicroAgda$File$upc,
			'intervalOps1',
			'∀ (i : I) → ∀ (j : I) → ∀ (k : I) → ∀ (l : I) → ∀ (m : I) → ∀ (n : I) → I',
			_List_fromArray(
				['i', 'j', 'k']),
			'λ l → λ m → λ n → ( ( k ∨ j ) ∨ i ) ∧ ( ~ ( k ∨ ( ~ k ) ∨ k ∨ ( ( ~ m ) ∨ ( ~ ( ~ j ) ) ∧ n ) ∨ k ) ) ∧ ~ n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'intervalOps2',
			'∀ (i : I) → ∀ (j : I) → ∀ (k : I) → ∀ (l : I) → ∀ (m : I) → ∀ (n : I) → I',
			_List_fromArray(
				['i', 'j', 'k']),
			'λ l → λ m → λ n → f1 l m n ',
			_List_Nil)
		]));
var $author$project$MicroAgda$SampleFiles$TestTypeErr$content = A2(
	$author$project$MicroAgda$File$mkFile,
	'testTypeErr',
	_List_fromArray(
		[
			A5(
			$author$project$MicroAgda$File$upc,
			'f1',
			'∀ (i : I) → ∀ (j : I) → ∀ (k : I) → I',
			_List_fromArray(
				['i', 'j', 'k']),
			'( k ∨ j ) ∨ (f11 i j)',
			_List_fromArray(
				[
					A5(
					$author$project$MicroAgda$File$upc,
					'f11',
					'∀ (ii : I) → ∀ (jj : I I) → I',
					_List_fromArray(
						['iii', 'jjj']),
					'k ∨ jjj',
					_List_fromArray(
						[
							A5(
							$author$project$MicroAgda$File$upc,
							'f111',
							'∀ (ii : I I) → ∀ (jj : I) → I',
							_List_fromArray(
								['iii', 'jjj']),
							'k ∨ jjj',
							_List_Nil),
							A5(
							$author$project$MicroAgda$File$upc,
							'f112',
							'∀ (ii : I) → ∀ (jj : I) → I',
							_List_fromArray(
								['iii', 'jjj']),
							'k ∨ jjj',
							_List_Nil)
						]))
				])),
			A5(
			$author$project$MicroAgda$File$upc,
			'intervalOps1',
			'∀ (i : I) → ∀ (j : I) → ∀ (k : I) → ∀ (l : I) → ∀ (m : I) → ∀ (n : I) → I',
			_List_fromArray(
				['i', 'j', 'k']),
			'λ l → λ m → λ n → ( ( k ∨ j ) ∨ i ) ∧ ( ~ ( k ∨ ( ~ k ) ∨ k ∨ ( ( ~ m ) ∨ ( ~ ( ~ j ) ) ∧ n ) ∨ k ) ) ∧ ~ n',
			_List_Nil),
			A5(
			$author$project$MicroAgda$File$upc,
			'intervalOps2',
			'∀ (i : I) → ∀ (j : I) → ∀ (k : I) → ∀ (l : I) → ∀ (m : I) → ∀ (n : I) → I',
			_List_fromArray(
				['i', 'j', 'k']),
			'λ l → λ m → λ n → f1 l m n ',
			_List_Nil)
		]));
var $author$project$MicroAgda$File$getUnParsedFileName = function (_v0) {
	var n = _v0.a;
	return n;
};
var $author$project$MicroAgda$SampleFiles$sampleFiles = $elm$core$Dict$fromList(
	A2(
		$elm$core$List$map,
		function (x) {
			return _Utils_Tuple2(
				$author$project$MicroAgda$File$getUnParsedFileName(x),
				x);
		},
		_List_fromArray(
			[$author$project$MicroAgda$SampleFiles$Test1$content, $author$project$MicroAgda$SampleFiles$TestTypeErr$content, $author$project$MicroAgda$SampleFiles$TestParseErr$content, $author$project$MicroAgda$SampleFiles$Prelude$content, $author$project$MicroAgda$SampleFiles$AssocAlt$content, $author$project$MicroAgda$SampleFiles$Assoc$content, $author$project$MicroAgda$SampleFiles$Sample$content, $author$project$MicroAgda$SampleFiles$FaceTest$content, $author$project$MicroAgda$BuildInFile$buildInFileCheck])));
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Main$setLocHash = _Platform_outgoingPort('setLocHash', $elm$json$Json$Encode$string);
var $author$project$Main$update = F2(
	function (msg, model) {
		return function (_v3) {
			var m = _v3.a;
			var c = _v3.b;
			return _Utils_Tuple2(
				m,
				A2(
					$elm$core$Maybe$withDefault,
					$author$project$Main$setLocHash(
						$author$project$Main$model2hash(m)),
					c));
		}(
			function () {
				switch (msg.$) {
					case 'LoadFile':
						var upf = msg.a;
						var _v1 = $author$project$MicroAgda$File$readFile(upf);
						var file = _v1.a;
						var mbC = _v1.b;
						var cm = _Utils_ap(
							'file ' + ($author$project$MicroAgda$File$getFileName(file) + ' loaded \n'),
							A2(
								$elm$core$Maybe$withDefault,
								'Error!',
								A2(
									$elm$core$Maybe$map,
									function (_v2) {
										return 'Ok!';
									},
									mbC)));
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									context: mbC,
									file: $elm$core$Maybe$Just(file),
									msg: cm
								}),
							$elm$core$Maybe$Nothing);
					case 'ReadFile':
						var upfName = msg.a;
						return A2(
							$elm$core$Maybe$withDefault,
							_Utils_Tuple2(
								_Utils_update(
									model,
									{msg: 'unable to load :' + upfName}),
								$elm$core$Maybe$Nothing),
							A2(
								$elm$core$Maybe$map,
								function (upf) {
									return _Utils_Tuple2(
										model,
										$elm$core$Maybe$Just(
											$author$project$Main$loadFileTask(upf)));
								},
								A2($elm$core$Dict$get, upfName, $author$project$MicroAgda$SampleFiles$sampleFiles)));
					case 'ShowDiagram':
						var defName = msg.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{cachedWinWork: $elm$core$Maybe$Nothing, fullScreenMode: true, selectedAddress: $elm$core$Maybe$Nothing, showName: defName}),
							$elm$core$Maybe$Just(
								A2(
									$elm$core$Task$perform,
									$elm$core$Basics$identity,
									$elm$core$Task$succeed($author$project$Main$UpdateInspectorSize))));
					case 'ExitFullScreen':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{fullScreenMode: false}),
							$elm$core$Maybe$Nothing);
					case 'FromWindow':
						var mbAddrs = msg.a;
						var mbCache = msg.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{cachedWinWork: mbCache, selectedAddress: mbAddrs}),
							$elm$core$Maybe$Nothing);
					case 'UpdateInspectorSize':
						return _Utils_Tuple2(
							model,
							$elm$core$Maybe$Just(
								A2(
									$elm$core$Task$attempt,
									A2(
										$elm$core$Basics$composeR,
										A2(
											$author$project$ResultExtra$convergeResult,
											$author$project$ResultExtra$const($elm$core$Maybe$Nothing),
											function (inf) {
												return $elm$core$Maybe$Just(
													_Utils_Tuple2(inf.element.width, inf.element.height));
											}),
										$author$project$Main$GotNewInspectorSize),
									$elm$browser$Browser$Dom$getElement('inspectorBox'))));
					default:
						var mbWH = msg.a;
						var insS = A2($elm$core$Debug$log, 'mbWH', mbWH);
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{inspectorSize: mbWH}),
							$elm$core$Maybe$Nothing);
				}
			}());
	});
var $rtfeldman$elm_css$VirtualDom$Styled$Node = F3(
	function (a, b, c) {
		return {$: 'Node', a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$VirtualDom$Styled$node = $rtfeldman$elm_css$VirtualDom$Styled$Node;
var $rtfeldman$elm_css$Html$Styled$node = $rtfeldman$elm_css$VirtualDom$Styled$node;
var $rtfeldman$elm_css$Html$Styled$div = $rtfeldman$elm_css$Html$Styled$node('div');
var $rtfeldman$elm_css$VirtualDom$Styled$Unstyled = function (a) {
	return {$: 'Unstyled', a: a};
};
var $rtfeldman$elm_css$VirtualDom$Styled$text = function (str) {
	return $rtfeldman$elm_css$VirtualDom$Styled$Unstyled(
		$elm$virtual_dom$VirtualDom$text(str));
};
var $rtfeldman$elm_css$Html$Styled$text = $rtfeldman$elm_css$VirtualDom$Styled$text;
var $author$project$Main$consoleView = function (model) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_Nil,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$text(model.msg)
			]));
};
var $rtfeldman$elm_css$VirtualDom$Styled$Attribute = F3(
	function (a, b, c) {
		return {$: 'Attribute', a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$VirtualDom$Styled$murmurSeed = 15739;
var $rtfeldman$elm_css$VirtualDom$Styled$getClassname = function (styles) {
	return $elm$core$List$isEmpty(styles) ? 'unstyled' : A2(
		$elm$core$String$cons,
		_Utils_chr('_'),
		$rtfeldman$elm_hex$Hex$toString(
			A2(
				$Skinney$murmur3$Murmur3$hashString,
				$rtfeldman$elm_css$VirtualDom$Styled$murmurSeed,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$compile(
					$elm$core$List$singleton(
						$rtfeldman$elm_css$Css$Preprocess$stylesheet(
							$elm$core$List$singleton(
								A2(
									$rtfeldman$elm_css$VirtualDom$Styled$makeSnippet,
									styles,
									$rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(_List_Nil)))))))));
};
var $elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $rtfeldman$elm_css$Html$Styled$Internal$css = function (styles) {
	var classname = $rtfeldman$elm_css$VirtualDom$Styled$getClassname(styles);
	var classProperty = A2(
		$elm$virtual_dom$VirtualDom$property,
		'className',
		$elm$json$Json$Encode$string(classname));
	return A3($rtfeldman$elm_css$VirtualDom$Styled$Attribute, classProperty, styles, classname);
};
var $rtfeldman$elm_css$Html$Styled$Attributes$css = $rtfeldman$elm_css$Html$Styled$Internal$css;
var $rtfeldman$elm_css$Css$Preprocess$AppendProperty = function (a) {
	return {$: 'AppendProperty', a: a};
};
var $rtfeldman$elm_css$Css$property = F2(
	function (key, value) {
		return $rtfeldman$elm_css$Css$Preprocess$AppendProperty(key + (':' + value));
	});
var $rtfeldman$elm_css$Css$prop1 = F2(
	function (key, arg) {
		return A2($rtfeldman$elm_css$Css$property, key, arg.value);
	});
var $rtfeldman$elm_css$Css$cursor = $rtfeldman$elm_css$Css$prop1('cursor');
var $author$project$ResultExtra$pairFrom = F3(
	function (f, g, a) {
		return _Utils_Tuple2(
			f(a),
			g(a));
	});
var $author$project$MicroAgda$File$definedDict = function (_v0) {
	var l = _v0.b;
	return $elm$core$Dict$fromList(
		A2(
			$elm$core$List$filterMap,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Result$toMaybe,
				$elm$core$Maybe$map(
					A2(
						$author$project$ResultExtra$pairFrom,
						$author$project$MicroAgda$File$getName,
						A2($author$project$ResultExtra$pairFrom, $author$project$MicroAgda$File$getSignatureCT, $author$project$MicroAgda$File$getBodyTm)))),
			l));
};
var $rtfeldman$elm_css$Css$display = $rtfeldman$elm_css$Css$prop1('display');
var $rtfeldman$elm_css$Css$Structure$Compatible = {$: 'Compatible'};
var $rtfeldman$elm_css$Css$inlineBlock = {display: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'inline-block'};
var $rtfeldman$elm_css$Css$margin = $rtfeldman$elm_css$Css$prop1('margin');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $rtfeldman$elm_css$VirtualDom$Styled$on = F2(
	function (eventName, handler) {
		return A3(
			$rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$on, eventName, handler),
			_List_Nil,
			'');
	});
var $rtfeldman$elm_css$Html$Styled$Events$on = F2(
	function (event, decoder) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $rtfeldman$elm_css$Html$Styled$Events$onClick = function (msg) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $rtfeldman$elm_css$Css$pointer = {cursor: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'pointer'};
var $rtfeldman$elm_css$Css$PxUnits = {$: 'PxUnits'};
var $elm$core$String$fromFloat = _String_fromNumber;
var $rtfeldman$elm_css$Css$Internal$lengthConverter = F3(
	function (units, unitLabel, numericValue) {
		return {
			absoluteLength: $rtfeldman$elm_css$Css$Structure$Compatible,
			calc: $rtfeldman$elm_css$Css$Structure$Compatible,
			flexBasis: $rtfeldman$elm_css$Css$Structure$Compatible,
			fontSize: $rtfeldman$elm_css$Css$Structure$Compatible,
			length: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrAutoOrCoverOrContain: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrMinMaxDimension: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrNone: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrNoneOrMinMaxDimension: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrNumber: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrNumberOrAutoOrNoneOrContent: $rtfeldman$elm_css$Css$Structure$Compatible,
			numericValue: numericValue,
			textIndent: $rtfeldman$elm_css$Css$Structure$Compatible,
			unitLabel: unitLabel,
			units: units,
			value: _Utils_ap(
				$elm$core$String$fromFloat(numericValue),
				unitLabel)
		};
	});
var $rtfeldman$elm_css$Css$px = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, $rtfeldman$elm_css$Css$PxUnits, 'px');
var $rtfeldman$elm_css$Css$textDecoration = $rtfeldman$elm_css$Css$prop1('text-decoration');
var $rtfeldman$elm_css$Css$underline = {textDecorationLine: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'underline'};
var $author$project$Main$defSelector = function (model) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_Nil,
		A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Dict$toList,
					$elm$core$List$map(
						function (_v0) {
							var name = _v0.a;
							var def = _v0.b;
							var s = _Utils_eq(name, model.showName) ? _List_fromArray(
								[
									$rtfeldman$elm_css$Css$textDecoration($rtfeldman$elm_css$Css$underline)
								]) : _List_Nil;
							return A2(
								$rtfeldman$elm_css$Html$Styled$div,
								_List_fromArray(
									[
										$rtfeldman$elm_css$Html$Styled$Attributes$css(
										A2(
											$elm$core$List$append,
											_List_fromArray(
												[
													$rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$inlineBlock),
													$rtfeldman$elm_css$Css$margin(
													$rtfeldman$elm_css$Css$px(3)),
													$rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer)
												]),
											s)),
										$rtfeldman$elm_css$Html$Styled$Events$onClick(
										$author$project$Main$ShowDiagram(name))
									]),
								_List_fromArray(
									[
										$rtfeldman$elm_css$Html$Styled$text(name)
									]));
						})),
				A2($elm$core$Maybe$map, $author$project$MicroAgda$File$definedDict, model.file))));
};
var $author$project$Main$FromWindow = F2(
	function (a, b) {
		return {$: 'FromWindow', a: a, b: b};
	});
var $author$project$ResultExtra$comp = F2(
	function (f, g) {
		return A2($elm$core$Basics$composeR, f, g);
	});
var $author$project$MicroAgda$File$defByName = A2(
	$elm$core$Basics$composeR,
	$elm$core$Dict$get,
	$author$project$ResultExtra$comp($author$project$MicroAgda$File$definedDict));
var $rtfeldman$elm_css$VirtualDom$Styled$KeyedNode = F3(
	function (a, b, c) {
		return {$: 'KeyedNode', a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$VirtualDom$Styled$KeyedNodeNS = F4(
	function (a, b, c, d) {
		return {$: 'KeyedNodeNS', a: a, b: b, c: c, d: d};
	});
var $rtfeldman$elm_css$VirtualDom$Styled$NodeNS = F4(
	function (a, b, c, d) {
		return {$: 'NodeNS', a: a, b: b, c: c, d: d};
	});
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$virtual_dom$VirtualDom$mapAttribute = _VirtualDom_mapAttribute;
var $rtfeldman$elm_css$VirtualDom$Styled$mapAttribute = F2(
	function (transform, _v0) {
		var prop = _v0.a;
		var styles = _v0.b;
		var classname = _v0.c;
		return A3(
			$rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$mapAttribute, transform, prop),
			styles,
			classname);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$map = F2(
	function (transform, vdomNode) {
		switch (vdomNode.$) {
			case 'Node':
				var elemType = vdomNode.a;
				var properties = vdomNode.b;
				var children = vdomNode.c;
				return A3(
					$rtfeldman$elm_css$VirtualDom$Styled$Node,
					elemType,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$mapAttribute(transform),
						properties),
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$map(transform),
						children));
			case 'NodeNS':
				var ns = vdomNode.a;
				var elemType = vdomNode.b;
				var properties = vdomNode.c;
				var children = vdomNode.d;
				return A4(
					$rtfeldman$elm_css$VirtualDom$Styled$NodeNS,
					ns,
					elemType,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$mapAttribute(transform),
						properties),
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$map(transform),
						children));
			case 'KeyedNode':
				var elemType = vdomNode.a;
				var properties = vdomNode.b;
				var children = vdomNode.c;
				return A3(
					$rtfeldman$elm_css$VirtualDom$Styled$KeyedNode,
					elemType,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$mapAttribute(transform),
						properties),
					A2(
						$elm$core$List$map,
						function (_v1) {
							var key = _v1.a;
							var child = _v1.b;
							return _Utils_Tuple2(
								key,
								A2($rtfeldman$elm_css$VirtualDom$Styled$map, transform, child));
						},
						children));
			case 'KeyedNodeNS':
				var ns = vdomNode.a;
				var elemType = vdomNode.b;
				var properties = vdomNode.c;
				var children = vdomNode.d;
				return A4(
					$rtfeldman$elm_css$VirtualDom$Styled$KeyedNodeNS,
					ns,
					elemType,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$mapAttribute(transform),
						properties),
					A2(
						$elm$core$List$map,
						function (_v2) {
							var key = _v2.a;
							var child = _v2.b;
							return _Utils_Tuple2(
								key,
								A2($rtfeldman$elm_css$VirtualDom$Styled$map, transform, child));
						},
						children));
			default:
				var vdom = vdomNode.a;
				return $rtfeldman$elm_css$VirtualDom$Styled$Unstyled(
					A2($elm$virtual_dom$VirtualDom$map, transform, vdom));
		}
	});
var $rtfeldman$elm_css$Html$Styled$map = $rtfeldman$elm_css$VirtualDom$Styled$map;
var $author$project$ResultExtra$pairR = F2(
	function (a, b) {
		return _Utils_Tuple2(b, a);
	});
var $author$project$MicroAgda$Viz$Structures$Cub = F2(
	function (a, b) {
		return {$: 'Cub', a: a, b: b};
	});
var $author$project$MicroAgda$Viz$Structures$Hcomp = F4(
	function (a, b, c, d) {
		return {$: 'Hcomp', a: a, b: b, c: c, d: d};
	});
var $avh4$elm_color$Color$RgbaSpace = F4(
	function (a, b, c, d) {
		return {$: 'RgbaSpace', a: a, b: b, c: c, d: d};
	});
var $avh4$elm_color$Color$black = A4($avh4$elm_color$Color$RgbaSpace, 0 / 255, 0 / 255, 0 / 255, 1.0);
var $author$project$MicroAgda$Viz$Style$borderComPar = 0.05;
var $author$project$MicroAgda$Viz$FloatFunctions$centerTransInv = F2(
	function (compPar, x) {
		return ((x - 0.5) * (1 - (compPar * 2))) + 0.5;
	});
var $author$project$Combinatorics$range = function (n) {
	return A2($elm$core$List$range, 0, n - 1);
};
var $author$project$Combinatorics$unTabulate = F3(
	function (a, la, i) {
		unTabulate:
		while (true) {
			var _v0 = _Utils_Tuple2(i, la);
			if (!_v0.b.b) {
				return a;
			} else {
				if (!_v0.a) {
					return a;
				} else {
					var _v1 = _v0.b;
					var x = _v1.a;
					var xs = _v1.b;
					var $temp$a = x,
						$temp$la = xs,
						$temp$i = i - 1;
					a = $temp$a;
					la = $temp$la;
					i = $temp$i;
					continue unTabulate;
				}
			}
		}
	});
var $author$project$Combinatorics$ambFnOnArr = F2(
	function (f, l) {
		if (!l.b) {
			return _List_Nil;
		} else {
			var x = l.a;
			var xs = l.b;
			return A2(
				$elm$core$List$map,
				f(
					A2($author$project$Combinatorics$unTabulate, x, xs)),
				$author$project$Combinatorics$range(
					$elm$core$List$length(l)));
		}
	});
var $author$project$MicroAgda$Drawing$mapCoords = function (f) {
	return $elm$core$List$map(
		$elm$core$Tuple$mapFirst(
			$elm$core$Tuple$mapSecond(
				$elm$core$List$map(
					$author$project$Combinatorics$ambFnOnArr(f)))));
};
var $author$project$ResultExtra$postcompose = F3(
	function (f, x, a) {
		return f(
			x(a));
	});
var $author$project$MicroAgda$Viz$Process$centerTransDrw = F2(
	function (cp, n) {
		return $author$project$MicroAgda$Drawing$mapCoords(
			$author$project$ResultExtra$postcompose(
				$author$project$MicroAgda$Viz$FloatFunctions$centerTransInv(cp)));
	});
var $author$project$MicroAgda$Drawing$combineDrawings = $elm$core$List$concat;
var $author$project$ResultExtra$listInsert = F3(
	function (i, a, l) {
		if (!i) {
			return A2($elm$core$List$cons, a, l);
		} else {
			if (!l.b) {
				return A2($elm$core$List$cons, a, _List_Nil);
			} else {
				var x = l.a;
				var xs = l.b;
				return A2(
					$elm$core$List$cons,
					x,
					A3($author$project$ResultExtra$listInsert, i - 1, a, xs));
			}
		}
	});
var $author$project$MicroAgda$Drawing$embedPrll = F2(
	function (k, f) {
		return $elm$core$Tuple$mapSecond(
			$elm$core$List$map(
				function (l) {
					return A3(
						$author$project$ResultExtra$listInsert,
						k,
						f(l),
						l);
				}));
	});
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $author$project$ResultExtra$choose = F3(
	function (b, f, t) {
		return b ? t : f;
	});
var $elm$core$Basics$pow = _Basics_pow;
var $author$project$MicroAgda$Drawing$ptZero = _Utils_Tuple2(
	0,
	_List_fromArray(
		[_List_Nil]));
var $author$project$MicroAgda$Drawing$sidePrll = F2(
	function (b, _v0) {
		var n = _v0.a;
		var l = _v0.b;
		return (!n) ? $author$project$MicroAgda$Drawing$ptZero : _Utils_Tuple2(
			n - 1,
			A2(
				A3($author$project$ResultExtra$choose, b, $elm$core$List$take, $elm$core$List$drop),
				A2($elm$core$Basics$pow, 2, n - 1),
				l));
	});
var $author$project$MicroAgda$Drawing$fillPrll = F2(
	function (k, _v3) {
		var n = _v3.a;
		var p = _v3.b;
		return A2(
			$author$project$MicroAgda$Drawing$fillPrllUS,
			A2($elm$core$Basics$min, k, n),
			_Utils_Tuple2(n, p));
	});
var $author$project$MicroAgda$Drawing$fillPrllUS = function (k) {
	if (!k) {
		return function (_v1) {
			var n = _v1.a;
			var l1 = _v1.b;
			return function (_v2) {
				var l2 = _v2.b;
				return _Utils_Tuple2(
					n + 1,
					A2($elm$core$List$append, l1, l2));
			};
		};
	} else {
		return function (p0) {
			return function (p1) {
				return A3(
					$author$project$MicroAgda$Drawing$fillPrll,
					0,
					A3(
						$author$project$MicroAgda$Drawing$fillPrll,
						k - 1,
						A2($author$project$MicroAgda$Drawing$sidePrll, false, p0),
						A2($author$project$MicroAgda$Drawing$sidePrll, false, p1)),
					A3(
						$author$project$MicroAgda$Drawing$fillPrll,
						k - 1,
						A2($author$project$MicroAgda$Drawing$sidePrll, true, p0),
						A2($author$project$MicroAgda$Drawing$sidePrll, true, p1)));
			};
		};
	}
};
var $author$project$MicroAgda$Drawing$degenDrawing = function (k) {
	return $elm$core$List$map(
		$elm$core$Tuple$mapFirst(
			function (x) {
				return A3(
					$author$project$MicroAgda$Drawing$fillPrll,
					k,
					A3(
						$author$project$MicroAgda$Drawing$embedPrll,
						k,
						$author$project$ResultExtra$const(0),
						x),
					A3(
						$author$project$MicroAgda$Drawing$embedPrll,
						k,
						$author$project$ResultExtra$const(1),
						x));
			}));
};
var $author$project$MicroAgda$Viz$Structures$nOfDimOfCtx = function (dc) {
	return A3(
		$elm$core$List$foldl,
		function (_v0) {
			var d = _v0.c;
			return function (k) {
				if ((d.$ === 'Just') && (d.a.$ === 'EInterval')) {
					var _v2 = d.a;
					return k + 1;
				} else {
					return k;
				}
			};
		},
		0,
		dc.list);
};
var $author$project$MicroAgda$Viz$Structures$dimOfCtx = function (dc) {
	return $author$project$MicroAgda$Viz$Structures$nOfDimOfCtx(dc) - $elm$core$List$length(
		$elm$core$Dict$keys(dc.bounds));
};
var $author$project$Combinatorics$SubFace = F2(
	function (a, b) {
		return {$: 'SubFace', a: a, b: b};
	});
var $author$project$Combinatorics$subFaceLI = function () {
	var toList = F2(
		function (n, k) {
			return (n > 0) ? A2(
				$elm$core$List$cons,
				function () {
					var _v0 = A2($elm$core$Basics$modBy, 3, k);
					switch (_v0) {
						case 0:
							return $elm$core$Maybe$Just(false);
						case 1:
							return $elm$core$Maybe$Just(true);
						default:
							return $elm$core$Maybe$Nothing;
					}
				}(),
				A2(toList, n - 1, (k / 3) | 0)) : _List_Nil;
		});
	var toInt = function (_v3) {
		var i = _v3.b;
		return i;
	};
	var fromList = function (l) {
		var n = $elm$core$List$length(l);
		if (l.b) {
			var x = l.a;
			var xs = l.b;
			return A2(
				$author$project$Combinatorics$SubFace,
				n,
				A2(
					$elm$core$Maybe$withDefault,
					2,
					A2(
						$elm$core$Maybe$map,
						function (xx) {
							return A3($author$project$ResultExtra$choose, xx, 0, 1);
						},
						x)) + (3 * toInt(
					fromList(xs))));
		} else {
			return A2($author$project$Combinatorics$SubFace, 0, 0);
		}
	};
	return {
		card: function (x) {
			return A2($elm$core$Basics$pow, 3, x);
		},
		fromI: $author$project$Combinatorics$SubFace,
		fromL: fromList,
		toI: toInt,
		toL: function (_v2) {
			var n = _v2.a;
			var k = _v2.b;
			return A2(toList, n, k);
		}
	};
}();
var $author$project$Combinatorics$faceToSubFace = F2(
	function (n, _v0) {
		var i = _v0.a;
		var b = _v0.b;
		return $author$project$Combinatorics$subFaceLI.fromL(
			A3(
				$author$project$ResultExtra$listInsert,
				i,
				$elm$core$Maybe$Just(b),
				A2($elm$core$List$repeat, n - 1, $elm$core$Maybe$Nothing)));
	});
var $author$project$MicroAgda$Drawing$mapDrawingData = function (f) {
	return $elm$core$List$map(
		$elm$core$Tuple$mapSecond(f));
};
var $author$project$MicroAgda$Drawing$masked = F2(
	function (m, x) {
		return A2(
			$elm$core$List$append,
			A2(
				$author$project$MicroAgda$Drawing$mapDrawingData,
				$author$project$ResultExtra$const($elm$core$Maybe$Nothing),
				m),
			A2(
				$author$project$MicroAgda$Drawing$mapDrawingData,
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Tuple$pair(true),
					$elm$core$Maybe$Just),
				x));
	});
var $author$project$MicroAgda$Drawing$facePrll = function (_v0) {
	var i = _v0.a;
	var b = _v0.b;
	if (!i) {
		return $author$project$MicroAgda$Drawing$sidePrll(b);
	} else {
		return function (x) {
			return A3(
				$author$project$MicroAgda$Drawing$fillPrll,
				0,
				A2(
					$author$project$MicroAgda$Drawing$facePrll,
					_Utils_Tuple2(i - 1, b),
					A2($author$project$MicroAgda$Drawing$sidePrll, false, x)),
				A2(
					$author$project$MicroAgda$Drawing$facePrll,
					_Utils_Tuple2(i - 1, b),
					A2($author$project$MicroAgda$Drawing$sidePrll, true, x)));
		};
	}
};
var $author$project$MicroAgda$Drawing$prllDim = A2(
	$elm$core$Basics$composeR,
	$elm$core$Tuple$second,
	A2(
		$elm$core$Basics$composeR,
		$elm$core$List$head,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Maybe$map($elm$core$List$length),
			$elm$core$Maybe$withDefault(0))));
var $author$project$ResultExtra$swap = F3(
	function (f, b, a) {
		return A2(f, a, b);
	});
var $author$project$ResultExtra$doAndPairR = F2(
	function (f, a) {
		return _Utils_Tuple2(
			a,
			f(a));
	});
var $author$project$Combinatorics$tabulateFaces = F2(
	function (n, f) {
		return A2(
			$elm$core$List$map,
			A2(
				$elm$core$Basics$composeR,
				function (x) {
					return _Utils_Tuple2(
						(x / 2) | 0,
						A2($elm$core$Basics$modBy, 2, x) > 0);
				},
				$author$project$ResultExtra$doAndPairR(f)),
			$author$project$Combinatorics$range(2 * n));
	});
var $author$project$MicroAgda$Drawing$drawFaces = F2(
	function (prl, f) {
		return A2(
			$elm$core$List$map,
			$elm$core$Tuple$second,
			A2(
				$author$project$Combinatorics$tabulateFaces,
				$author$project$MicroAgda$Drawing$prllDim(prl),
				A2(
					$author$project$ResultExtra$pairFrom,
					$author$project$ResultExtra$swap($author$project$MicroAgda$Drawing$facePrll)(prl),
					f)));
	});
var $author$project$ResultExtra$iter = F3(
	function (f, a, n) {
		if (!n) {
			return a;
		} else {
			return f(
				A3($author$project$ResultExtra$iter, f, a, n - 1));
		}
	});
var $author$project$MicroAgda$Drawing$unitHyCube = A2(
	$author$project$ResultExtra$iter,
	function (_v0) {
		var k = _v0.a;
		var x = _v0.b;
		return _Utils_Tuple2(
			k + 1,
			$elm$core$List$concat(
				_List_fromArray(
					[
						A2(
						$elm$core$List$map,
						A2($author$project$ResultExtra$listInsert, 0, 0.0),
						x),
						A2(
						$elm$core$List$map,
						A2($author$project$ResultExtra$listInsert, 0, 1.0),
						x)
					])));
	},
	$author$project$MicroAgda$Drawing$ptZero);
var $author$project$MicroAgda$Viz$Process$outlineNd = F2(
	function (n, a) {
		return A2(
			$author$project$MicroAgda$Drawing$drawFaces,
			$author$project$MicroAgda$Drawing$unitHyCube(n),
			$author$project$ResultExtra$const(a));
	});
var $author$project$ResultExtra$boolElim = F3(
	function (f, t, b) {
		return b ? t : f;
	});
var $author$project$ResultExtra$b2f = A2($author$project$ResultExtra$boolElim, 0.0, 1.0);
var $author$project$MicroAgda$Drawing$mapCoordsAsL = function (f) {
	return $elm$core$List$map(
		$elm$core$Tuple$mapFirst(
			$elm$core$Tuple$mapSecond(
				$elm$core$List$map(f))));
};
var $author$project$MicroAgda$Drawing$embed = F2(
	function (k, f) {
		return $author$project$MicroAgda$Drawing$mapCoordsAsL(
			function (l) {
				return A3(
					$author$project$ResultExtra$listInsert,
					k,
					f(l),
					l);
			});
	});
var $author$project$Combinatorics$lengthLI = F2(
	function (li, x) {
		return $elm$core$List$length(
			li.toL(x));
	});
var $author$project$MicroAgda$Viz$FloatFunctions$centerW = function (compPar) {
	return 1 - (compPar * 2);
};
var $author$project$ResultExtra$interp = F3(
	function (x0, x1, t) {
		return (x0 * (1 - t)) + (x1 * t);
	});
var $author$project$MicroAgda$Viz$FloatFunctions$negF = function (x) {
	return 1 - x;
};
var $author$project$MicroAgda$Viz$FloatFunctions$hhh = function (compPar) {
	return (1 - (2 * compPar)) / (2 * compPar);
};
var $author$project$MicroAgda$Viz$FloatFunctions$tanAlpha = function (compPar) {
	return 0.5 / (1 + $author$project$MicroAgda$Viz$FloatFunctions$hhh(compPar));
};
var $author$project$MicroAgda$Viz$FloatFunctions$vertSideFixInv = F2(
	function (compPar, y) {
		var cp = compPar;
		var dd = ($author$project$MicroAgda$Viz$FloatFunctions$hhh(cp) + 1) - y;
		var uu = ($author$project$MicroAgda$Viz$FloatFunctions$hhh(cp) * y) * $author$project$MicroAgda$Viz$FloatFunctions$tanAlpha(cp);
		return (uu / dd) * (1 / cp);
	});
var $author$project$MicroAgda$Viz$FloatFunctions$sideTransInv = F5(
	function (compPar, _v0, sk, f, k) {
		var i = _v0.a;
		var b = _v0.b;
		var q = f(i);
		var zz = A2($author$project$MicroAgda$Viz$FloatFunctions$vertSideFixInv, compPar, q);
		var qq = compPar * $author$project$MicroAgda$Viz$FloatFunctions$negF(zz);
		var z = b ? (1 - qq) : qq;
		return _Utils_eq(k, i) ? z : (sk ? (((f(k) - 0.5) / (1 / A3(
			$author$project$ResultExtra$interp,
			$author$project$MicroAgda$Viz$FloatFunctions$centerW(compPar),
			1,
			zz))) + 0.5) : ((f(k) - 0.5) + 0.5));
	});
var $author$project$MicroAgda$Viz$Process$sideTransDrw = F4(
	function (cp, n, f, _v0) {
		var x = _v0.a;
		var b = _v0.b;
		return A2(
			$author$project$MicroAgda$Drawing$mapCoords,
			A3($author$project$MicroAgda$Viz$FloatFunctions$sideTransInv, cp, f, b),
			x);
	});
var $author$project$Combinatorics$toFaceForce = function (sf) {
	return $elm$core$List$head(
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			A2(
				$elm$core$List$indexedMap,
				A2($elm$core$Basics$composeR, $elm$core$Tuple$pair, $elm$core$Maybe$map),
				$author$project$Combinatorics$subFaceLI.toL(sf))));
};
var $author$project$Combinatorics$toSubFaceRest = function (sf) {
	return A2(
		$elm$core$List$drop,
		1,
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			A2(
				$elm$core$List$indexedMap,
				A2($elm$core$Basics$composeR, $elm$core$Tuple$pair, $elm$core$Maybe$map),
				$author$project$Combinatorics$subFaceLI.toL(sf))));
};
var $author$project$MicroAgda$Viz$Process$sideTransSF = F3(
	function (cp, sf, _v0) {
		var x = _v0.a;
		var b = _v0.b;
		var rest = A2(
			$elm$core$List$map,
			function (_v1) {
				var i = _v1.a;
				var bb = _v1.b;
				return A2(
					$author$project$MicroAgda$Drawing$embed,
					i,
					$author$project$ResultExtra$const(
						$author$project$ResultExtra$b2f(bb)));
			},
			$author$project$Combinatorics$toSubFaceRest(sf));
		var xx = A3(
			$elm$core$List$foldr,
			function (f) {
				return function (d) {
					return f(d);
				};
			},
			x,
			rest);
		var n = A2($author$project$Combinatorics$lengthLI, $author$project$Combinatorics$subFaceLI, sf);
		return A2(
			$elm$core$Maybe$withDefault,
			x,
			A2(
				$elm$core$Maybe$map,
				function (f) {
					return A4(
						$author$project$MicroAgda$Viz$Process$sideTransDrw,
						cp,
						n,
						f,
						_Utils_Tuple2(xx, b));
				},
				$author$project$Combinatorics$toFaceForce(sf)));
	});
var $author$project$MicroAgda$Viz$Process$combineCell = F4(
	function (dc, n, center, fcs) {
		var borderSideFix = F2(
			function (_v0, drw) {
				var i = _v0.a;
				return _Utils_Tuple2(
					A2($author$project$MicroAgda$Drawing$degenDrawing, i, drw),
					false);
			});
		return A2(
			$elm$core$Result$andThen,
			function (x) {
				return _Utils_eq(
					$author$project$MicroAgda$Viz$Structures$dimOfCtx(dc),
					n) ? $elm$core$Result$Ok(x) : $elm$core$Result$Err('dim not matching context');
			},
			A2(
				$elm$core$Result$map,
				$author$project$MicroAgda$Drawing$combineDrawings,
				A2(
					$elm$core$Result$map,
					$elm$core$List$append(
						_List_fromArray(
							[
								A2(
								$author$project$MicroAgda$Drawing$masked,
								A2($author$project$MicroAgda$Viz$Process$outlineNd, n, _Utils_Tuple0),
								A2(
									$author$project$MicroAgda$Viz$Process$outlineNd,
									n,
									_Utils_Tuple2($avh4$elm_color$Color$black, _List_Nil)))
							])),
					A2(
						$elm$core$Result$map,
						function (x) {
							return A2(
								$elm$core$List$append,
								x,
								_List_fromArray(
									[
										A3($author$project$MicroAgda$Viz$Process$centerTransDrw, $author$project$MicroAgda$Viz$Style$borderComPar, n, center)
									]));
						},
						A2(
							$author$project$ResultExtra$mapListResult,
							$elm$core$Basics$identity,
							A2(
								$elm$core$List$map,
								$elm$core$Tuple$second,
								A2(
									$author$project$Combinatorics$tabulateFaces,
									n,
									function (f) {
										var sf = A2($author$project$Combinatorics$faceToSubFace, n, f);
										return A2(
											$elm$core$Result$map,
											A2($author$project$MicroAgda$Viz$Process$sideTransSF, $author$project$MicroAgda$Viz$Style$borderComPar, sf),
											A2(
												$elm$core$Result$map,
												borderSideFix(f),
												fcs(f)));
									})))))));
	});
var $author$project$ResultExtra$allSame = A2(
	$elm$core$Basics$composeR,
	$elm$core$Set$fromList,
	A2(
		$elm$core$Basics$composeR,
		$elm$core$Set$toList,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$length,
			function (n) {
				return n <= 1;
			})));
var $author$project$MicroAgda$Drawing$combineDrawingsSafe = A2(
	$elm$core$Basics$composeR,
	$author$project$MicroAgda$Drawing$combineDrawings,
	function (l) {
		return $author$project$ResultExtra$allSame(
			A2(
				$elm$core$List$map,
				A2($elm$core$Basics$composeR, $elm$core$Tuple$first, $author$project$MicroAgda$Drawing$prllDim),
				l)) ? $elm$core$Result$Ok(l) : $elm$core$Result$Err('cannot combine drawings of diferent dimensions');
	});
var $author$project$MicroAgda$Viz$FloatFunctions$defaultCompPar = 0.3;
var $author$project$MicroAgda$Viz$FloatFunctions$sideQ = F2(
	function (compPar, x) {
		return (_Utils_cmp(x, compPar) > 0) ? ((_Utils_cmp(x, 1 - compPar) < 0) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
			_Utils_Tuple2(1 - x, true))) : $elm$core$Maybe$Just(
			_Utils_Tuple2(x, false));
	});
var $author$project$MicroAgda$Viz$FloatFunctions$sideGet = F3(
	function (compPar, n0, amb) {
		if (!n0) {
			return $elm$core$Maybe$Nothing;
		} else {
			var n = n0;
			var _v1 = _Utils_Tuple2(
				A2(
					$author$project$MicroAgda$Viz$FloatFunctions$sideQ,
					compPar,
					amb(n - 1)),
				A3($author$project$MicroAgda$Viz$FloatFunctions$sideGet, compPar, n - 1, amb));
			if (_v1.a.$ === 'Nothing') {
				var _v2 = _v1.a;
				var x = _v1.b;
				return x;
			} else {
				if (_v1.b.$ === 'Nothing') {
					var _v3 = _v1.a.a;
					var xN = _v3.a;
					var bN = _v3.b;
					var _v4 = _v1.b;
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(
							_Utils_Tuple2(n - 1, xN),
							bN));
				} else {
					var _v5 = _v1.a.a;
					var xN = _v5.a;
					var bN = _v5.b;
					var _v6 = _v1.b.a;
					var _v7 = _v6.a;
					var i = _v7.a;
					var x = _v7.b;
					var b = _v6.b;
					return (_Utils_cmp(xN, x) < 0) ? $elm$core$Maybe$Just(
						_Utils_Tuple2(
							_Utils_Tuple2(n - 1, xN),
							bN)) : $elm$core$Maybe$Just(
						_Utils_Tuple2(
							_Utils_Tuple2(i, x),
							b));
				}
			}
		}
	});
var $author$project$MicroAgda$Viz$FloatFunctions$vertSideFix = F2(
	function (compPar, xx) {
		var cp = compPar;
		var h = (1 - (2 * cp)) / (2 * cp);
		var x = xx * cp;
		var z = ((1 / (((0.5 - cp) + x) * 2)) - 1) * h;
		return 1 - z;
	});
var $author$project$MicroAgda$Viz$FloatFunctions$piramFn = F3(
	function (compPar, n, lf) {
		return A2(
			$elm$core$Maybe$withDefault,
			0,
			A2(
				$elm$core$Maybe$map,
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Tuple$first,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Tuple$second,
						A2(
							$elm$core$Basics$composeR,
							function (x) {
								return x / compPar;
							},
							A2(
								$elm$core$Basics$composeR,
								$author$project$MicroAgda$Viz$FloatFunctions$negF,
								$author$project$MicroAgda$Viz$FloatFunctions$vertSideFix(compPar))))),
				A3(
					$author$project$MicroAgda$Viz$FloatFunctions$sideGet,
					compPar,
					n,
					A2(
						$elm$core$Basics$composeR,
						$author$project$ResultExtra$lookByIntInList(lf),
						$elm$core$Maybe$withDefault(0)))));
	});
var $author$project$MicroAgda$Viz$FloatFunctions$degenDrawingMissingSide = F3(
	function (compPar, n, _v0) {
		var k = _v0.a;
		var b = _v0.b;
		return $elm$core$List$map(
			function (_v1) {
				var _v2 = _v1.a;
				var m = _v2.a;
				var pl = _v2.b;
				var mc = _v1.b;
				return _Utils_Tuple2(
					function () {
						if (mc.$ === 'Nothing') {
							var efPiram = A2($author$project$MicroAgda$Viz$FloatFunctions$piramFn, compPar, n);
							var efFlat = $author$project$ResultExtra$const(1);
							return A3(
								$author$project$MicroAgda$Drawing$fillPrll,
								k,
								A3(
									$author$project$MicroAgda$Drawing$embedPrll,
									k,
									efFlat,
									_Utils_Tuple2(m, pl)),
								A3(
									$author$project$MicroAgda$Drawing$embedPrll,
									k,
									efPiram,
									_Utils_Tuple2(m, pl)));
						} else {
							var x = mc.a;
							return A3(
								$author$project$MicroAgda$Drawing$fillPrll,
								k,
								A3(
									$author$project$MicroAgda$Drawing$embedPrll,
									k,
									$author$project$ResultExtra$const(0),
									_Utils_Tuple2(m, pl)),
								A3(
									$author$project$MicroAgda$Drawing$embedPrll,
									k,
									$author$project$ResultExtra$const(1),
									_Utils_Tuple2(m, pl)));
						}
					}(),
					mc);
			});
	});
var $author$project$MicroAgda$Viz$Structures$describeErr = function (s) {
	return $elm$core$Result$mapError(
		function (e) {
			return s + (' \n' + A2($author$project$MicroAgda$StringTools$indent, 4, e));
		});
};
var $author$project$MicroAgda$Drawing$getDrawingDim = A2(
	$elm$core$Basics$composeR,
	$elm$core$List$head,
	$elm$core$Maybe$map(
		A2($elm$core$Basics$composeR, $elm$core$Tuple$first, $author$project$MicroAgda$Drawing$prllDim)));
var $author$project$ResultExtra$mb2Bool = function (m) {
	if (m.$ === 'Nothing') {
		return false;
	} else {
		return true;
	}
};
var $author$project$Combinatorics$getSubFaceDim = A2(
	$elm$core$Basics$composeR,
	$author$project$Combinatorics$subFaceLI.toL,
	A2(
		$elm$core$Basics$composeR,
		$elm$core$List$filter(
			A2($elm$core$Basics$composeR, $author$project$ResultExtra$mb2Bool, $elm$core$Basics$not)),
		$elm$core$List$length));
var $author$project$MicroAgda$Drawing$mapColor = A2(
	$elm$core$Basics$composeR,
	$elm$core$Tuple$mapFirst,
	A2(
		$elm$core$Basics$composeR,
		$elm$core$Tuple$mapSecond,
		A2($elm$core$Basics$composeR, $elm$core$Maybe$map, $author$project$MicroAgda$Drawing$mapDrawingData)));
var $avh4$elm_color$Color$hsla = F4(
	function (hue, sat, light, alpha) {
		var _v0 = _Utils_Tuple3(hue, sat, light);
		var h = _v0.a;
		var s = _v0.b;
		var l = _v0.c;
		var m2 = (l <= 0.5) ? (l * (s + 1)) : ((l + s) - (l * s));
		var m1 = (l * 2) - m2;
		var hueToRgb = function (h__) {
			var h_ = (h__ < 0) ? (h__ + 1) : ((h__ > 1) ? (h__ - 1) : h__);
			return ((h_ * 6) < 1) ? (m1 + (((m2 - m1) * h_) * 6)) : (((h_ * 2) < 1) ? m2 : (((h_ * 3) < 2) ? (m1 + (((m2 - m1) * ((2 / 3) - h_)) * 6)) : m1));
		};
		var b = hueToRgb(h - (1 / 3));
		var g = hueToRgb(h);
		var r = hueToRgb(h + (1 / 3));
		return A4($avh4$elm_color$Color$RgbaSpace, r, g, b, alpha);
	});
var $avh4$elm_color$Color$fromHsla = function (_v0) {
	var hue = _v0.hue;
	var saturation = _v0.saturation;
	var lightness = _v0.lightness;
	var alpha = _v0.alpha;
	return A4($avh4$elm_color$Color$hsla, hue, saturation, lightness, alpha);
};
var $elm$core$Basics$isNaN = _Basics_isNaN;
var $avh4$elm_color$Color$toHsla = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	var minColor = A2(
		$elm$core$Basics$min,
		r,
		A2($elm$core$Basics$min, g, b));
	var maxColor = A2(
		$elm$core$Basics$max,
		r,
		A2($elm$core$Basics$max, g, b));
	var l = (minColor + maxColor) / 2;
	var s = _Utils_eq(minColor, maxColor) ? 0 : ((l < 0.5) ? ((maxColor - minColor) / (maxColor + minColor)) : ((maxColor - minColor) / ((2 - maxColor) - minColor)));
	var h1 = _Utils_eq(maxColor, r) ? ((g - b) / (maxColor - minColor)) : (_Utils_eq(maxColor, g) ? (2 + ((b - r) / (maxColor - minColor))) : (4 + ((r - g) / (maxColor - minColor))));
	var h2 = h1 * (1 / 6);
	var h3 = $elm$core$Basics$isNaN(h2) ? 0 : ((h2 < 0) ? (h2 + 1) : h2);
	return {alpha: a, hue: h3, lightness: l, saturation: s};
};
var $author$project$MicroAgda$Viz$Style$missColTrans = A2(
	$elm$core$Basics$composeR,
	$avh4$elm_color$Color$toHsla,
	A2(
		$elm$core$Basics$composeR,
		function (x) {
			return (x.saturation > 0.8) ? _Utils_update(
				x,
				{
					lightness: $author$project$MicroAgda$Viz$FloatFunctions$negF(
						$author$project$MicroAgda$Viz$FloatFunctions$negF(x.lightness) * 0.5),
					saturation: 0.6
				}) : _Utils_update(
				x,
				{
					lightness: $author$project$MicroAgda$Viz$FloatFunctions$negF(
						$author$project$MicroAgda$Viz$FloatFunctions$negF(x.lightness) * 0.5)
				});
		},
		$avh4$elm_color$Color$fromHsla));
var $author$project$MicroAgda$Viz$Style$styliseMissing = $author$project$MicroAgda$Drawing$mapColor($author$project$MicroAgda$Viz$Style$missColTrans);
var $author$project$MicroAgda$Viz$Structures$EInterval = {$: 'EInterval'};
var $author$project$MicroAgda$Viz$Structures$extendI = F2(
	function (dc, s) {
		return _Utils_update(
			dc,
			{
				list: A2(
					$elm$core$List$cons,
					_Utils_Tuple3(
						s,
						$author$project$MicroAgda$Internal$Ctx$CT(
							A2(
								$author$project$MicroAgda$Internal$Term$Def,
								$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$Interval),
								_List_Nil)),
						$elm$core$Maybe$Just($author$project$MicroAgda$Viz$Structures$EInterval)),
					dc.list)
			});
	});
var $author$project$MicroAgda$Viz$Structures$DimIndex = function (a) {
	return {$: 'DimIndex', a: a};
};
var $author$project$MicroAgda$Viz$Structures$fromDimIndex = F2(
	function (dc, _v0) {
		var k = _v0.a;
		return A2(
			$elm$core$Maybe$withDefault,
			-1,
			A2(
				$elm$core$Maybe$map,
				$elm$core$Tuple$first,
				A3(
					$author$project$ResultExtra$swap,
					$author$project$ResultExtra$lookByIntInList,
					k,
					A2(
						$elm$core$List$filter,
						function (_v1) {
							var i = _v1.a;
							var _v2 = _v1.b;
							var x = _v2.c;
							if ((x.$ === 'Just') && (x.a.$ === 'EInterval')) {
								var _v4 = x.a;
								return !A2(
									$elm$core$Set$member,
									i,
									$elm$core$Set$fromList(
										$elm$core$Dict$keys(dc.bounds)));
							} else {
								return false;
							}
						},
						A2(
							$elm$core$List$indexedMap,
							$elm$core$Tuple$pair,
							$elm$core$List$reverse(dc.list))))));
	});
var $author$project$MicroAgda$Viz$Structures$mkBound = F2(
	function (dc, _v0) {
		var i = _v0.a;
		var b = _v0.b;
		return A2($elm$core$Dict$member, i, dc.bounds) ? $elm$core$Result$Err(
			'already in bounds! ' + $elm$core$String$fromInt(i)) : ((_Utils_cmp(
			$elm$core$List$length(dc.list),
			i) > 0) ? $elm$core$Result$Ok(
			_Utils_update(
				dc,
				{
					bounds: A3($elm$core$Dict$insert, i, b, dc.bounds)
				})) : $elm$core$Result$Err('not in context!'));
	});
var $author$project$MicroAgda$Viz$Structures$mkBoundSF = function (dc) {
	return A2(
		$elm$core$Basics$composeR,
		$author$project$Combinatorics$subFaceLI.toL,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$indexedMap($elm$core$Tuple$pair),
			A2(
				$elm$core$Basics$composeR,
				$elm$core$List$filterMap(
					function (_v0) {
						var i = _v0.a;
						var mx = _v0.b;
						return A2(
							$elm$core$Maybe$map,
							$elm$core$Tuple$pair(
								A2(
									$author$project$MicroAgda$Viz$Structures$fromDimIndex,
									dc,
									$author$project$MicroAgda$Viz$Structures$DimIndex(i))),
							mx);
					}),
				A2(
					$elm$core$List$foldr,
					function (_v1) {
						var i = _v1.a;
						var b = _v1.b;
						return $elm$core$Result$andThen(
							function (rdc) {
								return A2(
									$author$project$MicroAgda$Viz$Structures$mkBound,
									rdc,
									_Utils_Tuple2(i, b));
							});
					},
					$elm$core$Result$Ok(dc)))));
};
var $author$project$MicroAgda$Viz$Structures$subfaceCtx = F3(
	function (dc, vName, sf) {
		return A2(
			$elm$core$Result$map,
			A2($author$project$ResultExtra$swap, $author$project$MicroAgda$Viz$Structures$extendI, vName),
			A2($author$project$MicroAgda$Viz$Structures$mkBoundSF, dc, sf));
	});
var $author$project$Combinatorics$mapAllLI = F3(
	function (li, n, f) {
		return A2(
			$elm$core$List$map,
			A2(
				$elm$core$Basics$composeR,
				li.fromI(n),
				f),
			$author$project$Combinatorics$range(
				li.card(n)));
	});
var $author$project$Combinatorics$tabulateLIMaybe = F3(
	function (li, n, f) {
		return A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			A3(
				$author$project$Combinatorics$mapAllLI,
				li,
				n,
				function (a) {
					return A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$pair(a),
						f(a));
				}));
	});
var $author$project$Combinatorics$tabulateSubFaces = $author$project$Combinatorics$tabulateLIMaybe($author$project$Combinatorics$subFaceLI);
var $author$project$MicroAgda$Viz$Process$combineCells = function (_v0) {
	var dc = _v0.a;
	var n0 = _v0.b;
	var cn4 = _v0.c;
	var sideFix = function (sf) {
		var rn = $author$project$Combinatorics$getSubFaceDim(sf);
		var n = A2($author$project$Combinatorics$lengthLI, $author$project$Combinatorics$subFaceLI, sf);
		return A2(
			$elm$core$Maybe$withDefault,
			$author$project$ResultExtra$pairR(true),
			A2(
				$elm$core$Maybe$map,
				function (f) {
					return function (drw) {
						var _v4 = $author$project$MicroAgda$Drawing$getDrawingDim(drw);
						if (_v4.$ === 'Just') {
							var m = _v4.a;
							return _Utils_eq(m, rn + 1) ? (_Utils_eq(m, n) ? _Utils_Tuple2(drw, true) : _Utils_Tuple2(drw, true)) : ((_Utils_eq(m, n - 1) && _Utils_eq(rn, m)) ? _Utils_Tuple2(
								$author$project$MicroAgda$Viz$Style$styliseMissing(
									A4($author$project$MicroAgda$Viz$FloatFunctions$degenDrawingMissingSide, $author$project$MicroAgda$Viz$FloatFunctions$defaultCompPar, n - 1, f, drw)),
								false) : _Utils_Tuple2(_List_Nil, false));
						} else {
							return _Utils_Tuple2(drw, true);
						}
					};
				},
				$author$project$Combinatorics$toFaceForce(sf)));
	};
	var colA = F3(
		function (dcSF, nn, x) {
			return A2(
				$elm$core$Result$map,
				function (_v3) {
					var y = _v3.c;
					return y;
				},
				$author$project$MicroAgda$Viz$Process$combineCells(
					_Utils_Tuple3(dcSF, nn, x)));
		});
	if (cn4.$ === 'Cub') {
		var tm = cn4.a;
		var x = cn4.b;
		return $elm$core$Result$Ok(
			_Utils_Tuple3(dc, n0, x.whole));
	} else {
		var tm = cn4.a;
		var vName = cn4.b;
		var sides = cn4.c;
		var cap = cn4.d;
		var sidesDrw = A2(
			$elm$core$Result$map,
			$author$project$MicroAgda$Drawing$combineDrawings,
			A2(
				$author$project$ResultExtra$mapListResult,
				function (_v2) {
					var sf = _v2.a;
					var xx = _v2.b;
					return A2(
						$elm$core$Result$map,
						A2($author$project$MicroAgda$Viz$Process$sideTransSF, $author$project$MicroAgda$Viz$FloatFunctions$defaultCompPar, sf),
						A2(
							$elm$core$Result$map,
							sideFix(sf),
							A2(
								$elm$core$Result$andThen,
								function (dcSF) {
									return A3(
										colA,
										dcSF,
										$author$project$Combinatorics$getSubFaceDim(sf) + 1,
										xx);
								},
								A3($author$project$MicroAgda$Viz$Structures$subfaceCtx, dc, vName, sf))));
				},
				A2($author$project$Combinatorics$tabulateSubFaces, n0, sides)));
		var capDrw = A2(
			$elm$core$Result$map,
			A2($author$project$MicroAgda$Viz$Process$centerTransDrw, $author$project$MicroAgda$Viz$FloatFunctions$defaultCompPar, n0),
			A3(colA, dc, n0, cap));
		return A2(
			$author$project$MicroAgda$Viz$Structures$describeErr,
			'combineCells',
			A2(
				$elm$core$Result$map,
				function (x) {
					return _Utils_Tuple3(dc, n0, x);
				},
				A2(
					$elm$core$Result$andThen,
					$author$project$MicroAgda$Drawing$combineDrawingsSafe,
					A2(
						$author$project$ResultExtra$mapListResult,
						$elm$core$Basics$identity,
						_List_fromArray(
							[sidesDrw, capDrw])))));
	}
};
var $author$project$MicroAgda$Viz$Structures$CSet = function (a) {
	return {$: 'CSet', a: a};
};
var $author$project$Combinatorics$Subset = F2(
	function (a, b) {
		return {$: 'Subset', a: a, b: b};
	});
var $avh4$elm_color$Color$gray = A4($avh4$elm_color$Color$RgbaSpace, 211 / 255, 215 / 255, 207 / 255, 1.0);
var $avh4$elm_color$Color$hsl = F3(
	function (h, s, l) {
		return A4($avh4$elm_color$Color$hsla, h, s, l, 1.0);
	});
var $author$project$MicroAgda$Viz$FloatFunctions$modF = function (x) {
	return x - $elm$core$Basics$floor(x);
};
var $author$project$MicroAgda$Viz$FloatFunctions$nThColor = function (x) {
	return A3(
		$avh4$elm_color$Color$hsl,
		$author$project$MicroAgda$Viz$FloatFunctions$modF((3 / 16) * x),
		1.0,
		0.5);
};
var $author$project$MicroAgda$Drawing$scale = function (factor) {
	return $author$project$MicroAgda$Drawing$mapCoordsAsL(
		$elm$core$List$map(
			function (x) {
				return x * factor;
			}));
};
var $author$project$ResultExtra$zip = function (_v0) {
	var la = _v0.a;
	var lb = _v0.b;
	var _v1 = _Utils_Tuple2(la, lb);
	if (_v1.a.b && _v1.b.b) {
		var _v2 = _v1.a;
		var a = _v2.a;
		var ass = _v2.b;
		var _v3 = _v1.b;
		var b = _v3.a;
		var bss = _v3.b;
		return A2(
			$elm$core$List$cons,
			_Utils_Tuple2(a, b),
			$author$project$ResultExtra$zip(
				_Utils_Tuple2(ass, bss)));
	} else {
		return _List_Nil;
	}
};
var $author$project$ResultExtra$listTuples = A2(
	$elm$core$Basics$composeR,
	A2(
		$author$project$ResultExtra$pairFrom,
		$elm$core$List$drop(1),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$reverse,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$List$drop(1),
				$elm$core$List$reverse))),
	$author$project$ResultExtra$zip);
var $author$project$MicroAgda$Drawing$segmentsRange = F3(
	function (n, x0, xN) {
		return $author$project$ResultExtra$listTuples(
			A2(
				$elm$core$List$map,
				function (k) {
					return A3($author$project$ResultExtra$interp, x0, xN, k / n);
				},
				A2($elm$core$List$range, 0, n)));
	});
var $author$project$MicroAgda$Drawing$Seg = F2(
	function (a, b) {
		return {$: 'Seg', a: a, b: b};
	});
var $author$project$MicroAgda$Drawing$fromLSeg = A2(
	$elm$core$List$foldr,
	function (s) {
		if (s.$ === 'Pt') {
			var x = s.a;
			return A2(
				$author$project$MicroAgda$Drawing$embedPrll,
				0,
				$author$project$ResultExtra$const(x));
		} else {
			var x = s.a;
			var y = s.b;
			return function (z) {
				return A3(
					$author$project$MicroAgda$Drawing$fillPrll,
					0,
					A3(
						$author$project$MicroAgda$Drawing$embedPrll,
						0,
						$author$project$ResultExtra$const(x),
						z),
					A3(
						$author$project$MicroAgda$Drawing$embedPrll,
						0,
						$author$project$ResultExtra$const(y),
						z));
			};
		}
	},
	$author$project$MicroAgda$Drawing$ptZero);
var $author$project$MicroAgda$Drawing$spanPrll = F3(
	function (n, x0, x1) {
		return $author$project$MicroAgda$Drawing$fromLSeg(
			A2(
				$elm$core$List$repeat,
				n,
				A2($author$project$MicroAgda$Drawing$Seg, x0, x1)));
	});
var $author$project$Combinatorics$subsetLI = function () {
	var toList = F2(
		function (n, k) {
			return (n > 0) ? A2(
				$elm$core$List$cons,
				A2($elm$core$Basics$modBy, 2, k) === 1,
				A2(toList, n - 1, (k / 2) | 0)) : _List_Nil;
		});
	var toInt = function (_v2) {
		var i = _v2.b;
		return i;
	};
	var fromList = function (l) {
		var n = $elm$core$List$length(l);
		if (l.b) {
			var x = l.a;
			var xs = l.b;
			return A2(
				$author$project$Combinatorics$Subset,
				n,
				A3($author$project$ResultExtra$choose, x, 0, 1) + (2 * toInt(
					fromList(xs))));
		} else {
			return A2($author$project$Combinatorics$Subset, 0, 0);
		}
	};
	return {
		card: function (x) {
			return A2($elm$core$Basics$pow, 2, x);
		},
		fromI: $author$project$Combinatorics$Subset,
		fromL: fromList,
		toI: toInt,
		toL: function (_v1) {
			var n = _v1.a;
			var k = _v1.b;
			return A2(toList, n, k);
		}
	};
}();
var $author$project$ResultExtra$swapFn = $author$project$ResultExtra$swap;
var $author$project$MicroAgda$Drawing$translate = function (vec) {
	return $author$project$MicroAgda$Drawing$mapCoordsAsL(
		function (cl) {
			return A2(
				$elm$core$List$map,
				function (_v0) {
					var x = _v0.a;
					var delta = _v0.b;
					return x + delta;
				},
				$author$project$ResultExtra$zip(
					_Utils_Tuple2(cl, vec)));
		});
};
var $author$project$MicroAgda$Viz$Style$drawCSet = function (cs) {
	if (cs.$ === 'CSet') {
		if (!cs.a.a) {
			var _v1 = cs.a;
			var cSetCrnrs = _v1.b;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					$author$project$MicroAgda$Drawing$unitHyCube(0),
					_Utils_Tuple2(
						$author$project$MicroAgda$Viz$FloatFunctions$nThColor(
							cSetCrnrs(
								A2($author$project$Combinatorics$Subset, 0, 0)).b),
						_List_Nil))
				]);
		} else {
			var _v2 = cs.a;
			var n = _v2.a;
			var cSetCrnrs = _v2.b;
			var sideMargin = 0.3;
			var cornersColors = function (crnr) {
				return $author$project$MicroAgda$Viz$FloatFunctions$nThColor(
					cSetCrnrs(crnr).b);
			};
			var cornersCodes = A2(
				$elm$core$Basics$composeR,
				cSetCrnrs,
				A2($elm$core$Basics$composeR, $elm$core$Tuple$first, $elm$core$Tuple$second));
			var codeN = 3;
			var codeMarg = 0.2;
			var cornersShp = function (crnr) {
				return _Utils_ap(
					A2(
						$elm$core$List$filterMap,
						$elm$core$Basics$identity,
						A2(
							$elm$core$List$indexedMap,
							function (i) {
								return function (x) {
									return A2(
										$elm$core$Maybe$withDefault,
										false,
										A2(
											$author$project$ResultExtra$swapFn($author$project$ResultExtra$lookByIntInList),
											i,
											$author$project$Combinatorics$subsetLI.toL(
												A2(
													$author$project$Combinatorics$Subset,
													codeN,
													A2(
														$elm$core$Basics$modBy,
														A2($elm$core$Basics$pow, codeN, 2),
														cornersCodes(crnr)))))) ? $elm$core$Maybe$Just(x) : $elm$core$Maybe$Nothing;
								};
							},
							A2(
								$elm$core$List$map,
								function (_v4) {
									var x0 = _v4.a;
									var x1 = _v4.b;
									return _Utils_Tuple2(
										A3($author$project$MicroAgda$Drawing$spanPrll, n, x0 - (codeMarg / codeN), x1 + (codeMarg / codeN)),
										_Utils_Tuple2($avh4$elm_color$Color$gray, _List_Nil));
								},
								A3($author$project$MicroAgda$Drawing$segmentsRange, codeN, codeMarg / codeN, 1 - (codeMarg / codeN))))),
					_List_fromArray(
						[
							_Utils_Tuple2(
							$author$project$MicroAgda$Drawing$unitHyCube(n),
							_Utils_Tuple2(
								cornersColors(crnr),
								_List_Nil))
						]));
			};
			var centerMargin = 0.05;
			var size = (1.0 - centerMargin) - sideMargin;
			return $author$project$MicroAgda$Drawing$combineDrawings(
				$elm$core$List$reverse(
					A2(
						$elm$core$List$append,
						_List_fromArray(
							[
								_List_fromArray(
								[
									_Utils_Tuple2(
									$author$project$MicroAgda$Drawing$unitHyCube(n),
									_Utils_Tuple2($avh4$elm_color$Color$gray, _List_Nil))
								])
							]),
						A3(
							$author$project$Combinatorics$mapAllLI,
							$author$project$Combinatorics$subsetLI,
							n,
							function (crnr) {
								return A2(
									$author$project$MicroAgda$Drawing$mapCoordsAsL,
									function (l) {
										return A2(
											$elm$core$List$indexedMap,
											function (i) {
												return function (_v3) {
													var b = _v3.a;
													var f = _v3.b;
													return A3(
														$author$project$ResultExtra$choose,
														b,
														f,
														$author$project$MicroAgda$Viz$FloatFunctions$negF(f));
												};
											},
											$author$project$ResultExtra$zip(
												_Utils_Tuple2(
													$author$project$Combinatorics$subsetLI.toL(crnr),
													l)));
									},
									A2(
										$author$project$MicroAgda$Drawing$translate,
										A2($elm$core$List$repeat, n, sideMargin / 2),
										A2(
											$author$project$MicroAgda$Drawing$scale,
											size / 2,
											cornersShp(crnr))));
							}))));
		}
	} else {
		var k = cs.a;
		var x = cs.b;
		return A2(
			$author$project$MicroAgda$Drawing$degenDrawing,
			k,
			$author$project$MicroAgda$Viz$Style$drawCSet(x));
	}
};
var $author$project$MicroAgda$Viz$Structures$toInside = function (dd) {
	if (dd.$ === 'ECSet') {
		var x = dd.a;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$MicroAgda$Viz$Structures$lookInside = F2(
	function (dc, i) {
		return A2(
			$elm$core$Result$andThen,
			$elm$core$Result$fromMaybe('defined but not cubical'),
			A2(
				$elm$core$Result$andThen,
				function (_v0) {
					var x = _v0.c;
					return A2(
						$elm$core$Result$fromMaybe,
						'inside not defined',
						A2($elm$core$Maybe$map, $author$project$MicroAgda$Viz$Structures$toInside, x));
				},
				A2(
					$elm$core$Result$fromMaybe,
					'not in context',
					A2(
						$author$project$ResultExtra$lookByIntInList,
						$elm$core$List$reverse(dc.list),
						i))));
	});
var $author$project$Combinatorics$makeFnLI = function (li) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$List$map(
			$elm$core$Tuple$mapFirst(li.toI)),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Dict$fromList,
			A2(
				$elm$core$Basics$composeR,
				$author$project$ResultExtra$swap($elm$core$Dict$get),
				$author$project$ResultExtra$comp(li.toI))));
};
var $author$project$Combinatorics$Permutation = F2(
	function (a, b) {
		return {$: 'Permutation', a: a, b: b};
	});
var $author$project$Combinatorics$Piece = F3(
	function (a, b, c) {
		return {$: 'Piece', a: a, b: b, c: c};
	});
var $author$project$Combinatorics$isoPiece = A2(
	$elm$core$Tuple$pair,
	function (_v0) {
		var _v1 = _v0.a;
		var d = _v1.a;
		var i = _v1.b;
		var _v2 = _v0.b;
		var j = _v2.b;
		return A3($author$project$Combinatorics$Piece, d, i, j);
	},
	function (_v3) {
		var d = _v3.a;
		var i = _v3.b;
		var j = _v3.c;
		return _Utils_Tuple2(
			A2($author$project$Combinatorics$Subset, d, i),
			A2($author$project$Combinatorics$Permutation, d, j));
	});
var $author$project$Combinatorics$factorial = function (n) {
	switch (n) {
		case 0:
			return 1;
		case 1:
			return 1;
		case 2:
			return 2;
		case 3:
			return 6;
		case 4:
			return 24;
		case 5:
			return 120;
		default:
			return n * $author$project$Combinatorics$factorial(n - 1);
	}
};
var $author$project$Combinatorics$permutationLI = function () {
	var toList = F2(
		function (n, k) {
			return (n > 0) ? A2(
				$elm$core$List$cons,
				A2($elm$core$Basics$modBy, n, k),
				A2(toList, n - 1, (k / n) | 0)) : _List_Nil;
		});
	var toInt = function (_v2) {
		var i = _v2.b;
		return i;
	};
	var fromList = function (l) {
		var n = $elm$core$List$length(l);
		if (l.b) {
			var x = l.a;
			var xs = l.b;
			return A2(
				$author$project$Combinatorics$Permutation,
				n,
				x + (n * toInt(
					fromList(xs))));
		} else {
			return A2($author$project$Combinatorics$Permutation, 0, 0);
		}
	};
	return {
		card: $author$project$Combinatorics$factorial,
		fromI: $author$project$Combinatorics$Permutation,
		fromL: fromList,
		toI: toInt,
		toL: function (_v1) {
			var n = _v1.a;
			var k = _v1.b;
			return A2(toList, n, k);
		}
	};
}();
var $elm$core$List$unzip = function (pairs) {
	var step = F2(
		function (_v0, _v1) {
			var x = _v0.a;
			var y = _v0.b;
			var xs = _v1.a;
			var ys = _v1.b;
			return _Utils_Tuple2(
				A2($elm$core$List$cons, x, xs),
				A2($elm$core$List$cons, y, ys));
		});
	return A3(
		$elm$core$List$foldr,
		step,
		_Utils_Tuple2(_List_Nil, _List_Nil),
		pairs);
};
var $author$project$Combinatorics$prodLI = F3(
	function (aLI, bLI, _v0) {
		var to = _v0.a;
		var from = _v0.b;
		var toList = function (_v2) {
			var a = _v2.a;
			var b = _v2.b;
			return $author$project$ResultExtra$zip(
				_Utils_Tuple2(
					aLI.toL(a),
					bLI.toL(b)));
		};
		var fromList = A2(
			$elm$core$Basics$composeR,
			$elm$core$List$unzip,
			A2($elm$core$Tuple$mapBoth, aLI.fromL, bLI.fromL));
		return {
			card: function (x) {
				return aLI.card(x) * bLI.card(x);
			},
			fromI: function (n) {
				return function (i) {
					return to(
						_Utils_Tuple2(
							A2(
								aLI.fromI,
								n,
								A2(
									$elm$core$Basics$modBy,
									aLI.card(n),
									i)),
							A2(
								bLI.fromI,
								n,
								(i / aLI.card(n)) | 0)));
				};
			},
			fromL: A2($elm$core$Basics$composeR, fromList, to),
			toI: A2(
				$elm$core$Basics$composeR,
				from,
				function (_v1) {
					var a = _v1.a;
					var b = _v1.b;
					var ca = aLI.card(
						A2($author$project$Combinatorics$lengthLI, aLI, a));
					return (bLI.toI(b) * ca) + aLI.toI(a);
				}),
			toL: A2($elm$core$Basics$composeR, from, toList)
		};
	});
var $author$project$Combinatorics$pieceLI = A3($author$project$Combinatorics$prodLI, $author$project$Combinatorics$subsetLI, $author$project$Combinatorics$permutationLI, $author$project$Combinatorics$isoPiece);
var $author$project$Combinatorics$makeFnPiece = $author$project$Combinatorics$makeFnLI($author$project$Combinatorics$pieceLI);
var $author$project$Combinatorics$mapAllPieces = $author$project$Combinatorics$mapAllLI($author$project$Combinatorics$pieceLI);
var $author$project$ResultExtra$bool2Mb = function (b) {
	return A3(
		$author$project$ResultExtra$choose,
		b,
		$elm$core$Maybe$Nothing,
		$elm$core$Maybe$Just(_Utils_Tuple0));
};
var $author$project$MicroAgda$Viz$Remap$remapAbs = F3(
	function (r, _v0, a) {
		var dim = _v0.a;
		var l = _v0.b;
		var negAll = F2(
			function (lb, cs) {
				return A3(
					$elm$core$List$foldr,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Maybe$map(r.neg),
						$elm$core$Maybe$withDefault($elm$core$Basics$identity)),
					cs,
					A2(
						$elm$core$List$indexedMap,
						A2($elm$core$Basics$composeR, $author$project$ResultExtra$const, $elm$core$Maybe$map),
						A2(
							$elm$core$List$map,
							A2($elm$core$Basics$composeR, $elm$core$Basics$not, $author$project$ResultExtra$bool2Mb),
							lb)));
			});
		var degenMissing = function (_v1) {
			var cl = _v1.a;
			var li = _v1.b;
			return function (si) {
				return A3(
					$elm$core$List$foldl,
					r.degen,
					cl,
					$elm$core$Set$toList(si));
			}(
				A3(
					$elm$core$List$foldl,
					$elm$core$Set$remove,
					$elm$core$Set$fromList(
						$author$project$Combinatorics$range(dim)),
					li));
		};
		return degenMissing(
			r.diag(
				A2(
					r.rearange,
					A2($elm$core$List$map, $elm$core$Tuple$first, l),
					A2(
						negAll,
						A2($elm$core$List$map, $elm$core$Tuple$second, l),
						a))));
	});
var $author$project$MicroAgda$Viz$Structures$Degen = F2(
	function (a, b) {
		return {$: 'Degen', a: a, b: b};
	});
var $author$project$Combinatorics$mapAsList = F2(
	function (li, f) {
		return A2(
			$elm$core$Basics$composeR,
			li.toL,
			A2($elm$core$Basics$composeR, f, li.fromL));
	});
var $author$project$ResultExtra$mapAt = F2(
	function (i, f) {
		return $elm$core$List$indexedMap(
			function (j) {
				return function (x) {
					return _Utils_eq(j, i) ? f(x) : x;
				};
			});
	});
var $author$project$ResultExtra$precompose = F3(
	function (x, f, a) {
		return f(
			x(a));
	});
var $author$project$MicroAgda$Viz$Remap$insideNeg = function (i) {
	return $elm$core$Tuple$mapSecond(
		$author$project$ResultExtra$precompose(
			A2(
				$author$project$Combinatorics$mapAsList,
				$author$project$Combinatorics$subsetLI,
				A2($author$project$ResultExtra$mapAt, i, $elm$core$Basics$not))));
};
var $author$project$Combinatorics$punchOut = F2(
	function (k, i) {
		return (_Utils_cmp(i, k) < 0) ? i : (i - 1);
	});
var $author$project$MicroAgda$Viz$Remap$csetNeg = F2(
	function (i, cl) {
		if (cl.$ === 'CSet') {
			var ins = cl.a;
			return $author$project$MicroAgda$Viz$Structures$CSet(
				A2($author$project$MicroAgda$Viz$Remap$insideNeg, i, ins));
		} else {
			var k = cl.a;
			var x = cl.b;
			if (_Utils_eq(k, i)) {
				return A2($author$project$MicroAgda$Viz$Structures$Degen, k, x);
			} else {
				var ii = A2($author$project$Combinatorics$punchOut, k, i);
				return A2(
					$author$project$MicroAgda$Viz$Structures$Degen,
					k,
					A2($author$project$MicroAgda$Viz$Remap$csetNeg, ii, x));
			}
		}
	});
var $author$project$MicroAgda$Viz$Remap$diagCSetHead = function (cs) {
	var diagInside = A2(
		$elm$core$Tuple$mapBoth,
		function (x) {
			return x - 1;
		},
		$author$project$ResultExtra$precompose(
			A2(
				$author$project$Combinatorics$mapAsList,
				$author$project$Combinatorics$subsetLI,
				function (lb) {
					return A2(
						$elm$core$Maybe$withDefault,
						lb,
						A2(
							$elm$core$Maybe$map,
							function (h) {
								return A2($elm$core$List$cons, h, lb);
							},
							$elm$core$List$head(lb)));
				})));
	if (cs.$ === 'CSet') {
		var ins = cs.a;
		return $author$project$MicroAgda$Viz$Structures$CSet(
			diagInside(ins));
	} else {
		switch (cs.a) {
			case 0:
				var x = cs.b;
				return x;
			case 1:
				var x = cs.b;
				return x;
			default:
				var k = cs.a;
				var x = cs.b;
				return A2(
					$author$project$MicroAgda$Viz$Structures$Degen,
					k - 1,
					$author$project$MicroAgda$Viz$Remap$diagCSetHead(x));
		}
	}
};
var $author$project$MicroAgda$Viz$Remap$mapCSetUnder = function (f) {
	return $elm$core$Basics$identity;
};
var $author$project$Combinatorics$removeDupes = A2($elm$core$Basics$composeR, $elm$core$Set$fromList, $elm$core$Set$toList);
var $author$project$MicroAgda$Viz$Remap$diagCSet = function (_v0) {
	var cs = _v0.a;
	var l = _v0.b;
	return _Utils_Tuple2(
		function () {
			if (!l.b) {
				return cs;
			} else {
				if (!l.b.b) {
					var x = l.a;
					return cs;
				} else {
					var x = l.a;
					var _v2 = l.b;
					var y = _v2.a;
					var tl = _v2.b;
					return _Utils_eq(x, y) ? $author$project$MicroAgda$Viz$Remap$diagCSet(
						_Utils_Tuple2(
							$author$project$MicroAgda$Viz$Remap$diagCSetHead(cs),
							A2($elm$core$List$cons, y, tl))).a : A2(
						$author$project$MicroAgda$Viz$Remap$mapCSetUnder,
						function (cc) {
							return $author$project$MicroAgda$Viz$Remap$diagCSet(
								_Utils_Tuple2(
									cc,
									A2($elm$core$List$cons, y, tl))).a;
						},
						cs);
				}
			}
		}(),
		$author$project$Combinatorics$removeDupes(l));
};
var $author$project$ResultExtra$succ = function (i) {
	return i + 1;
};
var $author$project$ResultExtra$indexOf = F2(
	function (i, l) {
		if (!l.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var x = l.a;
			var xs = l.b;
			return _Utils_eq(x, i) ? $elm$core$Maybe$Just(0) : A2(
				$elm$core$Maybe$map,
				$author$project$ResultExtra$succ,
				A2($author$project$ResultExtra$indexOf, i, xs));
		}
	});
var $author$project$ResultExtra$removeFromList = F2(
	function (i, l) {
		var _v0 = _Utils_Tuple2(l, i);
		if (!_v0.a.b) {
			return _List_Nil;
		} else {
			if (!_v0.b) {
				var _v1 = _v0.a;
				var x = _v1.a;
				var xs = _v1.b;
				return xs;
			} else {
				var _v2 = _v0.a;
				var x = _v2.a;
				var xs = _v2.b;
				return A2(
					$elm$core$List$cons,
					x,
					A2($author$project$ResultExtra$removeFromList, i - 1, xs));
			}
		}
	});
var $author$project$Combinatorics$fromUsual = function () {
	var fu0 = function (li) {
		if (!li.b) {
			return _List_Nil;
		} else {
			var i = A2(
				$elm$core$Maybe$withDefault,
				0,
				A2($author$project$ResultExtra$indexOf, 0, li));
			var rest = A2($author$project$ResultExtra$removeFromList, i, li);
			return A2(
				$elm$core$List$cons,
				i,
				fu0(
					A2(
						$elm$core$List$map,
						function (x) {
							return x - 1;
						},
						rest)));
		}
	};
	return A2($elm$core$Basics$composeR, fu0, $author$project$Combinatorics$permutationLI.fromL);
}();
var $author$project$Combinatorics$permuteList = F2(
	function (p, l) {
		return A3(
			$elm$core$List$foldr,
			function (_v0) {
				var i = _v0.a;
				var a = _v0.b;
				return A2($author$project$ResultExtra$listInsert, i, a);
			},
			_List_Nil,
			$author$project$ResultExtra$zip(
				_Utils_Tuple2(
					$author$project$Combinatorics$permutationLI.toL(p),
					l)));
	});
var $author$project$Combinatorics$toUsual = function (pm) {
	return A2(
		$author$project$Combinatorics$permuteList,
		pm,
		A2(
			$elm$core$List$range,
			0,
			A2($author$project$Combinatorics$lengthLI, $author$project$Combinatorics$permutationLI, pm) - 1));
};
var $author$project$Combinatorics$mapUsual = function (f) {
	return A2(
		$elm$core$Basics$composeR,
		$author$project$Combinatorics$toUsual,
		A2($elm$core$Basics$composeR, f, $author$project$Combinatorics$fromUsual));
};
var $author$project$Combinatorics$invPermutation = $author$project$Combinatorics$mapUsual(
	function (l) {
		return A2(
			$elm$core$List$map,
			function (x) {
				return A2(
					$elm$core$Maybe$withDefault,
					0,
					A2($author$project$ResultExtra$indexOf, x, l));
			},
			$author$project$Combinatorics$range(
				$elm$core$List$length(l)));
	});
var $author$project$Combinatorics$permuteInt = F2(
	function (p, i) {
		return A2(
			$elm$core$Maybe$withDefault,
			-1,
			A2(
				$author$project$ResultExtra$indexOf,
				i,
				$author$project$Combinatorics$toUsual(p)));
	});
var $elm$core$List$sortBy = _List_sortBy;
var $elm$core$List$sort = function (xs) {
	return A2($elm$core$List$sortBy, $elm$core$Basics$identity, xs);
};
var $author$project$ResultExtra$applyTo = F2(
	function (g, f) {
		return f(g);
	});
var $author$project$Combinatorics$dedupAndSort = A2(
	$elm$core$Basics$composeR,
	$elm$core$Set$fromList,
	A2(
		$elm$core$Basics$composeR,
		$elm$core$Set$toList,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$sort,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$List$indexedMap(
					function (i) {
						return function (x) {
							return _Utils_Tuple2(x, i);
						};
					}),
				$elm$core$Dict$fromList))));
var $author$project$ResultExtra$findDuplicated = A2(
	$elm$core$Basics$composeR,
	A2(
		$elm$core$List$foldr,
		function (x) {
			return function (_v0) {
				var mbI = _v0.a;
				var st = _v0.b;
				if (mbI.$ === 'Just') {
					var y = mbI.a;
					return _Utils_Tuple2(
						$elm$core$Maybe$Just(y),
						st);
				} else {
					return A2($elm$core$Set$member, x, st) ? _Utils_Tuple2(
						$elm$core$Maybe$Just(x),
						st) : _Utils_Tuple2(
						$elm$core$Maybe$Nothing,
						A2($elm$core$Set$insert, x, st));
				}
			};
		},
		_Utils_Tuple2($elm$core$Maybe$Nothing, $elm$core$Set$empty)),
	$elm$core$Tuple$first);
var $author$project$ResultExtra$lastIndexOf = F2(
	function (i, l) {
		return A2(
			$elm$core$Maybe$map,
			function (ii) {
				return ($elm$core$List$length(l) - 1) - ii;
			},
			A2(
				$author$project$ResultExtra$indexOf,
				i,
				$elm$core$List$reverse(l)));
	});
var $author$project$ResultExtra$maybeLoop = F2(
	function (f, a) {
		return A2(
			$elm$core$Maybe$withDefault,
			a,
			A2(
				$elm$core$Maybe$map,
				$author$project$ResultExtra$maybeLoop(f),
				f(a)));
	});
var $author$project$Combinatorics$punchIn = F2(
	function (k, i) {
		return (_Utils_cmp(i, k) < 0) ? i : (i + 1);
	});
var $author$project$Combinatorics$fromDupli = function (li) {
	var fillD = $author$project$ResultExtra$maybeLoop(
		function (l) {
			return A2(
				$elm$core$Maybe$andThen,
				function (x) {
					return A2(
						$elm$core$Maybe$map,
						function (i) {
							return A3(
								$author$project$ResultExtra$mapAt,
								i,
								$author$project$ResultExtra$succ,
								A2(
									$elm$core$List$map,
									$author$project$Combinatorics$punchIn(
										$author$project$ResultExtra$succ(x)),
									l));
						},
						A2($author$project$ResultExtra$lastIndexOf, x, l));
				},
				$author$project$ResultExtra$findDuplicated(l));
		});
	return $author$project$Combinatorics$fromUsual(
		fillD(li));
};
var $author$project$Combinatorics$sortPerm = function (l) {
	var extracted = $author$project$Combinatorics$dedupAndSort(l);
	var confined = A2(
		$elm$core$List$map,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Dict$get,
			A2(
				$elm$core$Basics$composeR,
				$author$project$ResultExtra$applyTo(extracted),
				$elm$core$Maybe$withDefault(-1))),
		l);
	return $author$project$Combinatorics$fromDupli(confined);
};
var $author$project$MicroAgda$Viz$Remap$rearangeCSet = F2(
	function (l0, cl0) {
		var rCell = F2(
			function (l, cs) {
				var sortingPerm = $author$project$Combinatorics$sortPerm(l);
				var permuteInside = function (x) {
					return $elm$core$Tuple$mapSecond(
						$author$project$ResultExtra$precompose(
							A2(
								$author$project$Combinatorics$mapAsList,
								$author$project$Combinatorics$subsetLI,
								$author$project$Combinatorics$permuteList(x))));
				};
				var rearanged = function () {
					if (cs.$ === 'CSet') {
						var ins = cs.a;
						return $author$project$MicroAgda$Viz$Structures$CSet(
							A2(permuteInside, sortingPerm, ins));
					} else {
						var k = cs.a;
						var cst = cs.b;
						return A2(
							$author$project$MicroAgda$Viz$Structures$Degen,
							A2(
								$author$project$Combinatorics$permuteInt,
								$author$project$Combinatorics$invPermutation(sortingPerm),
								k),
							A2(
								rCell,
								A2($author$project$ResultExtra$removeFromList, k, l),
								cst));
					}
				}();
				return rearanged;
			});
		return _Utils_Tuple2(
			A2(rCell, l0, cl0),
			$elm$core$List$sort(l0));
	});
var $author$project$MicroAgda$Viz$Remap$remapableInside = {degen: $author$project$MicroAgda$Viz$Structures$Degen, diag: $author$project$MicroAgda$Viz$Remap$diagCSet, neg: $author$project$MicroAgda$Viz$Remap$csetNeg, rearange: $author$project$MicroAgda$Viz$Remap$rearangeCSet};
var $author$project$MicroAgda$Viz$Remap$remap = $author$project$MicroAgda$Viz$Remap$remapAbs($author$project$MicroAgda$Viz$Remap$remapableInside);
var $author$project$MicroAgda$Viz$Remap$tailPieces2Remap = F3(
	function (n, tp, pc) {
		return A2(
			$elm$core$Tuple$pair,
			n,
			A2(
				$elm$core$List$map,
				$author$project$ResultExtra$applyTo(pc),
				tp));
	});
var $author$project$MicroAgda$Viz$Process$drawInsidePieces = F4(
	function (dc, n, term, n2) {
		return A2(
			$elm$core$Result$andThen,
			function (ins) {
				return A2(
					$elm$core$Result$map,
					A2(
						$elm$core$Basics$composeR,
						$author$project$Combinatorics$makeFnPiece,
						$author$project$ResultExtra$postcompose(
							$elm$core$Maybe$withDefault(_List_Nil))),
					A2(
						$author$project$ResultExtra$mapListResult,
						$elm$core$Basics$identity,
						A2(
							$author$project$Combinatorics$mapAllPieces,
							n,
							function (pc) {
								var rmp = A3($author$project$MicroAgda$Viz$Remap$tailPieces2Remap, n, n2.tailPieces, pc);
								return $elm$core$Result$Ok(
									A2(
										$elm$core$Tuple$pair,
										pc,
										$author$project$MicroAgda$Viz$Style$drawCSet(
											A2(
												$author$project$MicroAgda$Viz$Remap$remap,
												rmp,
												$author$project$MicroAgda$Viz$Structures$CSet(ins)))));
							})));
			},
			A2($author$project$MicroAgda$Viz$Structures$lookInside, dc, n2.head));
	});
var $author$project$MicroAgda$Viz$Process$drawInsidePiecesStep = F5(
	function (dc, n, tm, _v0, n2) {
		return A2(
			$elm$core$Result$map,
			function (x) {
				return {zones: x};
			},
			A4($author$project$MicroAgda$Viz$Process$drawInsidePieces, dc, n, tm, n2));
	});
var $author$project$MicroAgda$Viz$Structures$cubMap = F2(
	function (f, pcb) {
		if (pcb.$ === 'Cub') {
			var tm = pcb.a;
			var x = pcb.b;
			return A2(
				$author$project$MicroAgda$Viz$Structures$Cub,
				tm,
				f(x));
		} else {
			var tm = pcb.a;
			var vName = pcb.b;
			var si = pcb.c;
			var bot = pcb.d;
			return A4(
				$author$project$MicroAgda$Viz$Structures$Hcomp,
				tm,
				vName,
				A2(
					$elm$core$Basics$composeR,
					si,
					$elm$core$Maybe$map(
						$author$project$MicroAgda$Viz$Structures$cubMap(f))),
				A2($author$project$MicroAgda$Viz$Structures$cubMap, f, bot));
		}
	});
var $author$project$MicroAgda$Viz$Structures$cubMapSubFace = F2(
	function (f, pcb) {
		if (pcb.$ === 'Cub') {
			var tm = pcb.a;
			var x = pcb.b;
			return A2($author$project$MicroAgda$Viz$Structures$Cub, tm, x);
		} else {
			var tm = pcb.a;
			var vName = pcb.b;
			var si = pcb.c;
			var bot = pcb.d;
			return A4(
				$author$project$MicroAgda$Viz$Structures$Hcomp,
				tm,
				vName,
				A2(
					$elm$core$Basics$composeR,
					f,
					A2(
						$elm$core$Basics$composeR,
						si,
						$elm$core$Maybe$map(
							$author$project$MicroAgda$Viz$Structures$cubMapSubFace(f)))),
				A2($author$project$MicroAgda$Viz$Structures$cubMapSubFace, f, bot));
		}
	});
var $author$project$MicroAgda$Viz$FloatFunctions$switchVars = F3(
	function (j, k, x) {
		return _Utils_eq(x, j) ? k : (_Utils_eq(x, k) ? j : x);
	});
var $author$project$MicroAgda$Viz$FloatFunctions$sideOrientationFixF = F2(
	function (n, _v0) {
		var i = _v0.a;
		var b = _v0.b;
		return $author$project$ResultExtra$precompose(
			A2($author$project$MicroAgda$Viz$FloatFunctions$switchVars, n - 1, i));
	});
var $author$project$MicroAgda$Viz$FloatFunctions$switchVarsSF = F2(
	function (n, sf) {
		return A2(
			$elm$core$Maybe$withDefault,
			$elm$core$Basics$identity,
			A2(
				$elm$core$Maybe$map,
				$author$project$ResultExtra$postcompose($author$project$Combinatorics$subFaceLI.fromL),
				A2(
					$elm$core$Maybe$map,
					function (_v0) {
						var j = _v0.a;
						return function (sff) {
							var sfl = $author$project$Combinatorics$subFaceLI.toL(sff);
							return A2(
								$elm$core$Maybe$withDefault,
								sfl,
								A2(
									$elm$core$Maybe$map,
									function (xx) {
										return A3(
											$author$project$ResultExtra$listInsert,
											j,
											xx,
											$elm$core$List$reverse(
												A2(
													$elm$core$List$drop,
													1,
													$elm$core$List$reverse(sfl))));
									},
									$elm$core$List$head(
										$elm$core$List$reverse(sfl))));
						};
					},
					$elm$core$List$head(
						A2(
							$elm$core$List$filterMap,
							$elm$core$Basics$identity,
							A2(
								$elm$core$List$indexedMap,
								A2($elm$core$Basics$composeR, $elm$core$Tuple$pair, $elm$core$Maybe$map),
								$author$project$Combinatorics$subFaceLI.toL(sf)))))));
	});
var $author$project$MicroAgda$Viz$Process$fixOrientation = function (_v0) {
	var n = _v0.a;
	var cn4 = _v0.b;
	if (cn4.$ === 'Cub') {
		var tm = cn4.a;
		var x = cn4.b;
		return A2($author$project$MicroAgda$Viz$Structures$Cub, tm, x);
	} else {
		var tm = cn4.a;
		var vName = cn4.b;
		var sides = cn4.c;
		var cap = cn4.d;
		return A4(
			$author$project$MicroAgda$Viz$Structures$Hcomp,
			tm,
			vName,
			function (sf) {
				return A2(
					$elm$core$Maybe$andThen,
					function (f) {
						var _v2 = f;
						var j = _v2.a;
						var b = _v2.b;
						return A2(
							$elm$core$Maybe$map,
							function (sisf) {
								var n3 = $author$project$Combinatorics$getSubFaceDim(sf) + 1;
								return A2(
									$author$project$MicroAgda$Viz$Structures$cubMapSubFace,
									A2($author$project$MicroAgda$Viz$FloatFunctions$switchVarsSF, j, sf),
									A2(
										$author$project$MicroAgda$Viz$Structures$cubMap,
										function (n4) {
											return _Utils_update(
												n4,
												{
													whole: A2(
														$author$project$MicroAgda$Drawing$mapCoords,
														A2(
															$author$project$MicroAgda$Viz$FloatFunctions$sideOrientationFixF,
															n,
															_Utils_Tuple2(j, b)),
														n4.whole)
												});
										},
										$author$project$MicroAgda$Viz$Process$fixOrientation(
											_Utils_Tuple2(n3, sisf))));
							},
							sides(sf));
					},
					$author$project$Combinatorics$toFaceForce(sf));
			},
			$author$project$MicroAgda$Viz$Process$fixOrientation(
				_Utils_Tuple2(n, cap)));
	}
};
var $author$project$Combinatorics$makeFnSubFace = $author$project$Combinatorics$makeFnLI($author$project$Combinatorics$subFaceLI);
var $elm$core$Result$map2 = F3(
	function (func, ra, rb) {
		if (ra.$ === 'Err') {
			var x = ra.a;
			return $elm$core$Result$Err(x);
		} else {
			var a = ra.a;
			if (rb.$ === 'Err') {
				var x = rb.a;
				return $elm$core$Result$Err(x);
			} else {
				var b = rb.a;
				return $elm$core$Result$Ok(
					A2(func, a, b));
			}
		}
	});
var $author$project$MicroAgda$Viz$Process$pieceMask = F2(
	function (n, pc) {
		var pieceMaskH = A2(
			$elm$core$List$foldr,
			function (_v1) {
				var b = _v1.a;
				var i = _v1.b;
				return function (prl) {
					return A3(
						$author$project$MicroAgda$Drawing$fillPrll,
						i,
						A3(
							$author$project$MicroAgda$Drawing$embedPrll,
							i,
							$author$project$ResultExtra$const(0.5),
							A2(
								$elm$core$Tuple$mapSecond,
								$elm$core$List$map(
									$elm$core$List$map(
										$author$project$ResultExtra$const(0.5))),
								prl)),
						A3(
							$author$project$MicroAgda$Drawing$embedPrll,
							i,
							$author$project$ResultExtra$const(
								$author$project$ResultExtra$b2f(b)),
							prl));
				};
			},
			$author$project$MicroAgda$Drawing$ptZero);
		var _v0 = A2(
			$elm$core$Tuple$mapFirst,
			$author$project$Combinatorics$subsetLI.toL,
			A2($elm$core$Tuple$second, $author$project$Combinatorics$isoPiece, pc));
		var cornerL = _v0.a;
		var perm = _v0.b;
		var cornerL2 = A2($author$project$Combinatorics$permuteList, perm, cornerL);
		return _List_fromArray(
			[
				_Utils_Tuple2(
				pieceMaskH(
					$author$project$ResultExtra$zip(
						_Utils_Tuple2(
							cornerL2,
							$author$project$Combinatorics$permutationLI.toL(perm)))),
				$author$project$Combinatorics$pieceLI.toI(pc))
			]);
	});
var $author$project$MicroAgda$Viz$Process$piecesCombine = F2(
	function (n, pcsD) {
		return $elm$core$Result$Ok(
			$author$project$MicroAgda$Drawing$combineDrawings(
				A2(
					$author$project$Combinatorics$mapAllPieces,
					n,
					function (pc) {
						return A2(
							$author$project$MicroAgda$Drawing$masked,
							A2($author$project$MicroAgda$Viz$Process$pieceMask, n, pc),
							pcsD(pc));
					})));
	});
var $author$project$MicroAgda$Viz$Process$piecesCombineStep = F5(
	function (dc, n, _v0, _v1, n3) {
		return A2(
			$elm$core$Result$map,
			function (x) {
				return {whole: x};
			},
			A2($author$project$MicroAgda$Viz$Process$piecesCombine, n, n3.zones));
	});
var $author$project$Combinatorics$subFaceCenter = function (n) {
	return $author$project$Combinatorics$subFaceLI.fromL(
		A2($elm$core$List$repeat, n, $elm$core$Maybe$Nothing));
};
var $author$project$MicroAgda$Viz$Structures$stepMap = function (f) {
	var stepMapIns = function (adrs) {
		return $elm$core$Result$andThen(
			function (_v0) {
				var dc = _v0.a;
				var n = _v0.b;
				var ca = _v0.c;
				return A2(
					$elm$core$Result$map,
					function (x) {
						return _Utils_Tuple3(dc, n, x);
					},
					function () {
						if (ca.$ === 'Cub') {
							var tm = ca.a;
							var a = ca.b;
							return A2(
								$elm$core$Result$map,
								$author$project$MicroAgda$Viz$Structures$Cub(tm),
								A5(f, dc, n, tm, adrs, a));
						} else {
							var tm = ca.a;
							var vName = ca.b;
							var sides = ca.c;
							var cap = ca.d;
							return A2(
								$elm$core$Result$andThen,
								function (_v2) {
									var cap2 = _v2.c;
									return A2(
										$elm$core$Result$map,
										function (sides2) {
											return A4(
												$author$project$MicroAgda$Viz$Structures$Hcomp,
												tm,
												vName,
												$author$project$Combinatorics$makeFnSubFace(sides2),
												cap2);
										},
										A2(
											$elm$core$Result$map,
											$elm$core$List$filterMap(
												function (_v5) {
													var sf = _v5.a;
													var mb = _v5.b;
													return A2(
														$elm$core$Maybe$map,
														$elm$core$Tuple$pair(sf),
														mb);
												}),
											A2(
												$author$project$ResultExtra$mapListResult,
												function (_v3) {
													var sf = _v3.a;
													var ma = _v3.b;
													return A2(
														$elm$core$Result$andThen,
														function (dc2) {
															var dc3 = A2($author$project$MicroAgda$Viz$Structures$extendI, dc2, vName);
															var n3 = $author$project$MicroAgda$Viz$Structures$dimOfCtx(dc3);
															return A2(
																$elm$core$Result$map,
																$elm$core$Tuple$pair(sf),
																A2(
																	$elm$core$Result$map,
																	$elm$core$Maybe$map(
																		function (_v4) {
																			var x = _v4.c;
																			return x;
																		}),
																	$author$project$ResultExtra$maybeMixRes(
																		A2(
																			$elm$core$Maybe$map,
																			function (a) {
																				return A2(
																					stepMapIns,
																					_Utils_ap(
																						adrs,
																						_List_fromArray(
																							[sf])),
																					$elm$core$Result$Ok(
																						_Utils_Tuple3(dc3, n3, a)));
																			},
																			ma))));
														},
														A2($author$project$MicroAgda$Viz$Structures$mkBoundSF, dc, sf));
												},
												A3(
													$author$project$Combinatorics$mapAllLI,
													$author$project$Combinatorics$subFaceLI,
													n,
													$author$project$ResultExtra$doAndPairR(sides)))));
								},
								A2(
									stepMapIns,
									_Utils_ap(
										adrs,
										_List_fromArray(
											[
												$author$project$Combinatorics$subFaceCenter(n)
											])),
									$elm$core$Result$Ok(
										_Utils_Tuple3(dc, n, cap))));
						}
					}());
			});
	};
	return stepMapIns(_List_Nil);
};
var $author$project$MicroAgda$Viz$Structures$termFace = F3(
	function (dc, _v0, tm) {
		var i = _v0.a;
		var b = _v0.b;
		var termI = A2(
			$author$project$MicroAgda$Viz$Structures$fromDimIndex,
			dc,
			$author$project$MicroAgda$Viz$Structures$DimIndex(i));
		return A2(
			$author$project$MicroAgda$Viz$Structures$describeErr,
			'termFace',
			A3(
				$author$project$MicroAgda$Internal$Term$substIC2,
				termI,
				$author$project$MicroAgda$Internal$Term$mkIEnd(b),
				tm));
	});
var $author$project$MicroAgda$Viz$Structures$getFresh = function (x) {
	return $elm$core$List$length(x.list);
};
var $author$project$Combinatorics$subFaceFromDict = F2(
	function (n, d) {
		return $author$project$Combinatorics$subFaceLI.fromL(
			A2(
				$elm$core$List$map,
				$author$project$ResultExtra$swap($elm$core$Dict$get)(d),
				$author$project$Combinatorics$range(n)));
	});
var $author$project$MicroAgda$Internal$Term$toHcompCases = function (ltm) {
	if (ltm.$ === 'Lam') {
		var abs = ltm.a;
		var bo = ltm.b;
		var _v1 = bo.unAbs;
		if ((_v1.$ === 'LamP') && (!_v1.b.b)) {
			var pcs = _v1.a;
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(bo.absName, pcs));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$ResultExtra$isLessThan = F2(
	function (x, y) {
		var _v0 = A2($elm$core$Basics$compare, y, x);
		if (_v0.$ === 'LT') {
			return true;
		} else {
			return false;
		}
	});
var $author$project$MicroAgda$Viz$Structures$truncateCtx = F2(
	function (i, dc) {
		return _Utils_update(
			dc,
			{
				bounds: A2(
					$elm$core$Dict$filter,
					A2(
						$elm$core$Basics$composeR,
						$author$project$ResultExtra$isLessThan(i),
						$author$project$ResultExtra$const),
					dc.bounds),
				list: A3(
					$elm$core$Basics$composeR,
					$elm$core$List$reverse,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$List$take(i),
						$elm$core$List$reverse),
					dc.list)
			});
	});
var $author$project$MicroAgda$Viz$Structures$getDimIndex = F2(
	function (dc, i) {
		return A2(
			$author$project$MicroAgda$Viz$Structures$describeErr,
			'getDimIndex',
			A2(
				$elm$core$Result$map,
				function (_v4) {
					return $author$project$MicroAgda$Viz$Structures$DimIndex(
						$author$project$MicroAgda$Viz$Structures$dimOfCtx(
							A2($author$project$MicroAgda$Viz$Structures$truncateCtx, i, dc)));
				},
				A2(
					$elm$core$Result$andThen,
					function (_v0) {
						var cty = _v0.b;
						var x = _v0.c;
						if ((((cty.a.$ === 'Def') && (cty.a.a.$ === 'BuildIn')) && (cty.a.a.a.$ === 'Interval')) && (!cty.a.b.b)) {
							var _v2 = cty.a;
							var _v3 = _v2.a.a;
							return $elm$core$Result$Ok(_Utils_Tuple0);
						} else {
							return $elm$core$Result$Err('not interval!');
						}
					},
					A2(
						$elm$core$Result$fromMaybe,
						'not in context ctxLen:' + ($elm$core$String$fromInt(
							$elm$core$List$length(dc.list)) + (' tried: ' + $elm$core$String$fromInt(i))),
						A2(
							$author$project$ResultExtra$lookByIntInList,
							$elm$core$List$reverse(dc.list),
							i)))));
	});
var $author$project$MicroAgda$Viz$Structures$toVarAndIndex = F2(
	function (dc, tm) {
		if (((tm.$ === 'Def') && (tm.a.$ === 'FromContext')) && (!tm.b.b)) {
			var i = tm.a.a;
			return A2(
				$elm$core$Result$map,
				$elm$core$Tuple$pair(i),
				A2($author$project$MicroAgda$Viz$Structures$getDimIndex, dc, i));
		} else {
			return $elm$core$Result$Err('not in normal form');
		}
	});
var $author$project$MicroAgda$Viz$Process$step0 = function (_v0) {
	var tm = _v0.a;
	var dc = _v0.b;
	var dim = $author$project$MicroAgda$Viz$Structures$dimOfCtx(dc);
	var mkCase = F2(
		function (varN, pc) {
			return A2(
				$elm$core$Result$andThen,
				function (_v13) {
					var cc = _v13.a;
					var sf = _v13.b;
					return A2(
						$elm$core$Result$andThen,
						function (bo2) {
							return A2(
								$elm$core$Result$map,
								$elm$core$Tuple$pair(sf),
								$author$project$MicroAgda$Viz$Process$step0(
									_Utils_Tuple2(
										bo2,
										A2($author$project$MicroAgda$Viz$Structures$extendI, cc, varN))));
						},
						A2(
							$author$project$MicroAgda$Internal$Term$absApply,
							$author$project$MicroAgda$Internal$Term$notAbs(pc.body),
							$author$project$MicroAgda$Internal$Term$ctxVar(
								$author$project$MicroAgda$Viz$Structures$getFresh(dc))));
				},
				A2(
					$elm$core$Result$map,
					$elm$core$Tuple$mapSecond(
						$author$project$Combinatorics$subFaceFromDict(dim)),
					A3(
						$elm$core$List$foldl,
						function (_v10) {
							var tmv = _v10.a;
							var b = _v10.b;
							return $elm$core$Result$andThen(
								function (_v11) {
									var c = _v11.a;
									var sf = _v11.b;
									return A2(
										$elm$core$Result$andThen,
										function (_v12) {
											var i = _v12.a;
											var j = _v12.b.a;
											return A2(
												$elm$core$Result$map,
												function (c2) {
													return _Utils_Tuple2(
														c2,
														A3($elm$core$Dict$insert, j, b, sf));
												},
												A2(
													$author$project$MicroAgda$Viz$Structures$mkBound,
													c,
													_Utils_Tuple2(i, b)));
										},
										A2($author$project$MicroAgda$Viz$Structures$toVarAndIndex, dc, tmv));
								});
						},
						$elm$core$Result$Ok(
							_Utils_Tuple2(dc, $elm$core$Dict$empty)),
						pc.subFace)));
		});
	var mkSides = function (ptm) {
		return A2(
			$elm$core$Result$andThen,
			function (_v9) {
				var varN = _v9.a;
				var pcs = _v9.b;
				return A2(
					$elm$core$Result$map,
					A2(
						$elm$core$Basics$composeR,
						$author$project$Combinatorics$makeFnSubFace,
						$elm$core$Tuple$pair(varN)),
					A2(
						$author$project$ResultExtra$mapListResult,
						mkCase(varN),
						pcs));
			},
			A2(
				$elm$core$Result$fromMaybe,
				'ImposibleError, not proper sides in hcomp',
				$author$project$MicroAgda$Internal$Term$toHcompCases(ptm)));
	};
	return A2(
		$author$project$MicroAgda$Viz$Structures$describeErr,
		'step0',
		function () {
			if (((((((((tm.$ === 'Def') && (tm.a.$ === 'BuildIn')) && (tm.a.a.$ === 'Hcomp')) && tm.b.b) && tm.b.b.b) && tm.b.b.b.b) && tm.b.b.b.b.b) && tm.b.b.b.b.b.b) && (!tm.b.b.b.b.b.b.b)) {
				var _v2 = tm.a.a;
				var _v3 = tm.b;
				var _v4 = _v3.b;
				var _v5 = _v4.b;
				var _v6 = _v5.b;
				var sidesE = _v6.a;
				var _v7 = _v6.b;
				var botE = _v7.a;
				return A3(
					$elm$core$Basics$apR,
					mkSides(
						$author$project$MicroAgda$Internal$Term$elimArg(sidesE)),
					$elm$core$Result$map2(
						function (_v8) {
							var name = _v8.a;
							var y = _v8.b;
							return function (x) {
								return A4($author$project$MicroAgda$Viz$Structures$Hcomp, tm, name, y, x);
							};
						}),
					$author$project$MicroAgda$Viz$Process$step0(
						_Utils_Tuple2(
							$author$project$MicroAgda$Internal$Term$elimArg(botE),
							dc)));
			} else {
				return $elm$core$Result$Ok(
					A2(
						$author$project$MicroAgda$Viz$Structures$Cub,
						tm,
						{term: tm}));
			}
		}());
};
var $author$project$MicroAgda$Viz$PiecesEval$pieceEval = F3(
	function (dc, tm0, pc) {
		var toDI = $elm$core$Tuple$mapFirst(
			A2(
				$elm$core$Basics$composeR,
				$author$project$MicroAgda$Viz$Structures$getDimIndex(dc),
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Result$map(
						function (_v50) {
							var x = _v50.a;
							return x;
						}),
					$elm$core$Result$withDefault(-1))));
		var peSortVia = F3(
			function (ca, _v0, _v1) {
				peSortVia:
				while (true) {
					var i1 = _v0.a;
					var b1 = _v0.b;
					var i2 = _v1.a;
					var b2 = _v1.b;
					if (ca.b) {
						var _v3 = ca.a;
						var i = _v3.a;
						var b = _v3.b;
						var tl = ca.b;
						var _v4 = _Utils_Tuple2(
							_Utils_eq(i, i1) && _Utils_eq(b, b1),
							_Utils_eq(i, i2) && _Utils_eq(b, b2));
						if (_v4.a) {
							return true;
						} else {
							if (_v4.b) {
								return false;
							} else {
								var $temp$ca = tl,
									$temp$_v0 = _Utils_Tuple2(i1, b1),
									$temp$_v1 = _Utils_Tuple2(i2, b2);
								ca = $temp$ca;
								_v0 = $temp$_v0;
								_v1 = $temp$_v1;
								continue peSortVia;
							}
						}
					} else {
						return true;
					}
				}
			});
		var peEnc = function (_v49) {
			var k = _v49.a;
			var b = _v49.b;
			return b ? $elm$core$Maybe$Just(
				A2(
					$author$project$MicroAgda$Internal$Term$Def,
					$author$project$MicroAgda$Internal$Term$FromContext(k),
					_List_Nil)) : $elm$core$Maybe$Just(
				A2(
					$author$project$MicroAgda$Internal$Term$Def,
					$author$project$MicroAgda$Internal$Term$BuildIn($author$project$MicroAgda$Internal$Term$Neg),
					_List_fromArray(
						[
							$author$project$MicroAgda$Internal$Term$elim(
							A2(
								$author$project$MicroAgda$Internal$Term$Def,
								$author$project$MicroAgda$Internal$Term$FromContext(k),
								_List_Nil))
						])));
		};
		var _v5 = A3($elm$core$Basics$apR, $author$project$Combinatorics$isoPiece, $elm$core$Tuple$second, pc);
		var crn = _v5.a;
		var prm = _v5.b;
		var compArr = function () {
			var ca = A2(
				$elm$core$List$map,
				$elm$core$Tuple$mapSecond($elm$core$Basics$not),
				A2(
					$author$project$Combinatorics$permuteList,
					prm,
					A2(
						$elm$core$List$indexedMap,
						$elm$core$Tuple$pair,
						$author$project$Combinatorics$subsetLI.toL(crn))));
			return _Utils_ap(
				ca,
				$elm$core$List$reverse(
					A2(
						$elm$core$List$map,
						$elm$core$Tuple$mapSecond($elm$core$Basics$not),
						ca)));
		}();
		var peSort = F2(
			function (x, y) {
				return A3(
					peSortVia,
					compArr,
					toDI(x),
					toDI(y));
			});
		var peMax = F2(
			function (x, y) {
				return A2(peSort, x, y) ? y : x;
			});
		var peMin = F2(
			function (x, y) {
				return A2(peSort, x, y) ? x : y;
			});
		var evF = function (tm) {
			var _v6 = $author$project$MicroAgda$Internal$Term$tmBIView(tm);
			_v6$8:
			while (true) {
				_v6$9:
				while (true) {
					_v6$10:
					while (true) {
						if (_v6.$ === 'JB2') {
							switch (_v6.a.$) {
								case 'Min':
									switch (_v6.b.$) {
										case 'JT':
											if (((_v6.b.a.$ === 'Def') && (_v6.b.a.a.$ === 'FromContext')) && (!_v6.b.a.b.b)) {
												switch (_v6.c.$) {
													case 'JT':
														if (((_v6.c.a.$ === 'Def') && (_v6.c.a.a.$ === 'FromContext')) && (!_v6.c.a.b.b)) {
															var _v27 = _v6.a;
															var _v28 = _v6.b.a;
															var x = _v28.a.a;
															var _v29 = _v6.c.a;
															var y = _v29.a.a;
															return peEnc(
																A2(
																	peMin,
																	_Utils_Tuple2(x, true),
																	_Utils_Tuple2(y, true)));
														} else {
															break _v6$8;
														}
													case 'JB1':
														if (((((_v6.c.a.$ === 'Neg') && (_v6.c.b.$ === 'JT')) && (_v6.c.b.a.$ === 'Def')) && (_v6.c.b.a.a.$ === 'FromContext')) && (!_v6.c.b.a.b.b)) {
															var _v35 = _v6.a;
															var _v36 = _v6.b.a;
															var x = _v36.a.a;
															var _v37 = _v6.c;
															var _v38 = _v37.a;
															var _v39 = _v37.b.a;
															var y = _v39.a.a;
															return peEnc(
																A2(
																	peMin,
																	_Utils_Tuple2(x, true),
																	_Utils_Tuple2(y, false)));
														} else {
															break _v6$8;
														}
													default:
														break _v6$8;
												}
											} else {
												break _v6$8;
											}
										case 'JB1':
											if (((((_v6.b.a.$ === 'Neg') && (_v6.b.b.$ === 'JT')) && (_v6.b.b.a.$ === 'Def')) && (_v6.b.b.a.a.$ === 'FromContext')) && (!_v6.b.b.a.b.b)) {
												switch (_v6.c.$) {
													case 'JT':
														if (((_v6.c.a.$ === 'Def') && (_v6.c.a.a.$ === 'FromContext')) && (!_v6.c.a.b.b)) {
															var _v30 = _v6.a;
															var _v31 = _v6.b;
															var _v32 = _v31.a;
															var _v33 = _v31.b.a;
															var x = _v33.a.a;
															var _v34 = _v6.c.a;
															var y = _v34.a.a;
															return peEnc(
																A2(
																	peMin,
																	_Utils_Tuple2(x, false),
																	_Utils_Tuple2(y, true)));
														} else {
															break _v6$8;
														}
													case 'JB1':
														if (((((_v6.c.a.$ === 'Neg') && (_v6.c.b.$ === 'JT')) && (_v6.c.b.a.$ === 'Def')) && (_v6.c.b.a.a.$ === 'FromContext')) && (!_v6.c.b.a.b.b)) {
															var _v40 = _v6.a;
															var _v41 = _v6.b;
															var _v42 = _v41.a;
															var _v43 = _v41.b.a;
															var x = _v43.a.a;
															var _v44 = _v6.c;
															var _v45 = _v44.a;
															var _v46 = _v44.b.a;
															var y = _v46.a.a;
															return peEnc(
																A2(
																	peMin,
																	_Utils_Tuple2(x, false),
																	_Utils_Tuple2(y, false)));
														} else {
															break _v6$8;
														}
													default:
														break _v6$8;
												}
											} else {
												break _v6$8;
											}
										default:
											break _v6$8;
									}
								case 'Max':
									switch (_v6.b.$) {
										case 'JT':
											if (((_v6.b.a.$ === 'Def') && (_v6.b.a.a.$ === 'FromContext')) && (!_v6.b.a.b.b)) {
												switch (_v6.c.$) {
													case 'JT':
														if (((_v6.c.a.$ === 'Def') && (_v6.c.a.a.$ === 'FromContext')) && (!_v6.c.a.b.b)) {
															var _v7 = _v6.a;
															var _v8 = _v6.b.a;
															var x = _v8.a.a;
															var _v9 = _v6.c.a;
															var y = _v9.a.a;
															return peEnc(
																A2(
																	peMax,
																	_Utils_Tuple2(x, true),
																	_Utils_Tuple2(y, true)));
														} else {
															break _v6$9;
														}
													case 'JB1':
														if (((((_v6.c.a.$ === 'Neg') && (_v6.c.b.$ === 'JT')) && (_v6.c.b.a.$ === 'Def')) && (_v6.c.b.a.a.$ === 'FromContext')) && (!_v6.c.b.a.b.b)) {
															var _v15 = _v6.a;
															var _v16 = _v6.b.a;
															var x = _v16.a.a;
															var _v17 = _v6.c;
															var _v18 = _v17.a;
															var _v19 = _v17.b.a;
															var y = _v19.a.a;
															return peEnc(
																A2(
																	peMax,
																	_Utils_Tuple2(x, true),
																	_Utils_Tuple2(y, false)));
														} else {
															break _v6$9;
														}
													default:
														break _v6$9;
												}
											} else {
												break _v6$9;
											}
										case 'JB1':
											if (((((_v6.b.a.$ === 'Neg') && (_v6.b.b.$ === 'JT')) && (_v6.b.b.a.$ === 'Def')) && (_v6.b.b.a.a.$ === 'FromContext')) && (!_v6.b.b.a.b.b)) {
												switch (_v6.c.$) {
													case 'JT':
														if (((_v6.c.a.$ === 'Def') && (_v6.c.a.a.$ === 'FromContext')) && (!_v6.c.a.b.b)) {
															var _v10 = _v6.a;
															var _v11 = _v6.b;
															var _v12 = _v11.a;
															var _v13 = _v11.b.a;
															var x = _v13.a.a;
															var _v14 = _v6.c.a;
															var y = _v14.a.a;
															return peEnc(
																A2(
																	peMax,
																	_Utils_Tuple2(x, false),
																	_Utils_Tuple2(y, true)));
														} else {
															break _v6$9;
														}
													case 'JB1':
														if (((((_v6.c.a.$ === 'Neg') && (_v6.c.b.$ === 'JT')) && (_v6.c.b.a.$ === 'Def')) && (_v6.c.b.a.a.$ === 'FromContext')) && (!_v6.c.b.a.b.b)) {
															var _v20 = _v6.a;
															var _v21 = _v6.b;
															var _v22 = _v21.a;
															var _v23 = _v21.b.a;
															var x = _v23.a.a;
															var _v24 = _v6.c;
															var _v25 = _v24.a;
															var _v26 = _v24.b.a;
															var y = _v26.a.a;
															return peEnc(
																A2(
																	peMax,
																	_Utils_Tuple2(x, false),
																	_Utils_Tuple2(y, false)));
														} else {
															break _v6$9;
														}
													default:
														break _v6$9;
												}
											} else {
												break _v6$9;
											}
										default:
											break _v6$9;
									}
								default:
									break _v6$10;
							}
						} else {
							break _v6$10;
						}
					}
					return $elm$core$Maybe$Nothing;
				}
				var _v48 = _v6.a;
				var x = _v6.b;
				var y = _v6.c;
				return A2(
					$elm$core$Maybe$withDefault,
					A2(
						$elm$core$Maybe$map,
						function (t2) {
							return $author$project$MicroAgda$Internal$Term$fromBIView(
								A3(
									$author$project$MicroAgda$Internal$Term$JB2,
									$author$project$MicroAgda$Internal$Term$Max,
									x,
									$author$project$MicroAgda$Internal$Term$JT(t2)));
						},
						evF(
							$author$project$MicroAgda$Internal$Term$fromBIView(y))),
					A2(
						$elm$core$Maybe$map,
						function (t2) {
							return $elm$core$Maybe$Just(
								$author$project$MicroAgda$Internal$Term$fromBIView(
									A3(
										$author$project$MicroAgda$Internal$Term$JB2,
										$author$project$MicroAgda$Internal$Term$Max,
										$author$project$MicroAgda$Internal$Term$JT(t2),
										y)));
						},
						evF(
							$author$project$MicroAgda$Internal$Term$fromBIView(x))));
			}
			var _v47 = _v6.a;
			var x = _v6.b;
			var y = _v6.c;
			return A2(
				$elm$core$Maybe$map,
				function (t2) {
					return $author$project$MicroAgda$Internal$Term$fromBIView(
						A3(
							$author$project$MicroAgda$Internal$Term$JB2,
							$author$project$MicroAgda$Internal$Term$Min,
							x,
							$author$project$MicroAgda$Internal$Term$JT(t2)));
				},
				evF(
					$author$project$MicroAgda$Internal$Term$fromBIView(y)));
		};
		return A2($author$project$ResultExtra$maybeLoop, evF, tm0);
	});
var $author$project$MicroAgda$Viz$PiecesEval$piecesStrat = F2(
	function (dc, tm) {
		var fList = A2(
			$author$project$ResultExtra$mapListResult,
			$elm$core$Basics$identity,
			A2(
				$author$project$Combinatorics$mapAllPieces,
				$author$project$MicroAgda$Viz$Structures$dimOfCtx(dc),
				function (pc) {
					return A2(
						$elm$core$Result$map,
						$elm$core$Tuple$pair(pc),
						function (tm1) {
							_v0$4:
							while (true) {
								if (tm1.$ === 'Def') {
									if (tm1.a.$ === 'FromContext') {
										if (!tm1.b.b) {
											var k = tm1.a.a;
											return A2(
												$elm$core$Result$map,
												function (_v3) {
													var j = _v3.a;
													return _Utils_Tuple2(j, true);
												},
												A2($author$project$MicroAgda$Viz$Structures$getDimIndex, dc, k));
										} else {
											break _v0$4;
										}
									} else {
										if (!tm1.b.b) {
											switch (tm1.a.a.$) {
												case 'I1':
													var _v1 = tm1.a.a;
													return $elm$core$Result$Err('interval end spotted!');
												case 'I0':
													var _v2 = tm1.a.a;
													return $elm$core$Result$Err('interval end spotted!');
												default:
													break _v0$4;
											}
										} else {
											if ((tm1.a.a.$ === 'Neg') && (!tm1.b.b.b)) {
												var _v4 = tm1.a.a;
												var _v5 = tm1.b;
												var x = _v5.a;
												var _v6 = $author$project$MicroAgda$Internal$Term$elimArg(x);
												if (((_v6.$ === 'Def') && (_v6.a.$ === 'FromContext')) && (!_v6.b.b)) {
													var k = _v6.a.a;
													return A2(
														$elm$core$Result$map,
														function (_v7) {
															var j = _v7.a;
															return _Utils_Tuple2(j, false);
														},
														A2($author$project$MicroAgda$Viz$Structures$getDimIndex, dc, k));
												} else {
													return $elm$core$Result$Err('pieces strat error 2');
												}
											} else {
												break _v0$4;
											}
										}
									}
								} else {
									break _v0$4;
								}
							}
							return $elm$core$Result$Err('pieces strat error');
						}(
							A3($author$project$MicroAgda$Viz$PiecesEval$pieceEval, dc, tm, pc)));
				}));
		return A2(
			$author$project$MicroAgda$Viz$Structures$describeErr,
			'piecesStrat',
			A2(
				$elm$core$Result$map,
				function (f) {
					return A2(
						$elm$core$Basics$composeR,
						f,
						$elm$core$Maybe$withDefault(
							_Utils_Tuple2(-1, true)));
				},
				A2($elm$core$Result$map, $author$project$Combinatorics$makeFnPiece, fList)));
	});
var $author$project$MicroAgda$Viz$PiecesEval$piecesStratTail = F2(
	function (dc, tl) {
		return A2(
			$author$project$ResultExtra$mapListResult,
			$author$project$MicroAgda$Viz$PiecesEval$piecesStrat(dc),
			tl);
	});
var $author$project$MicroAgda$Viz$Process$step1 = F5(
	function (dc, n, _v0, _v1, n1) {
		return A2(
			$author$project$MicroAgda$Viz$Structures$describeErr,
			'step1 ' + $author$project$MicroAgda$Internal$Translate$t2strNoCtx(n1.term),
			function () {
				var _v2 = n1.term;
				if ((_v2.$ === 'Def') && (_v2.a.$ === 'FromContext')) {
					var i = _v2.a.a;
					var tl = _v2.b;
					var il = A2($elm$core$List$map, $author$project$MicroAgda$Internal$Term$elimArg, tl);
					return A2(
						$elm$core$Result$map,
						function (tp) {
							return {head: i, original: true, tailClean: il, tailPieces: tp};
						},
						A2($author$project$MicroAgda$Viz$PiecesEval$piecesStratTail, dc, il));
				} else {
					return $elm$core$Result$Err('nor hcomp, nor propper definition with tail');
				}
			}());
	});
var $author$project$MicroAgda$Viz$Process$tm2Cub = F2(
	function (dc, tm) {
		return A2(
			$author$project$MicroAgda$Viz$Structures$stepMap,
			$author$project$MicroAgda$Viz$Process$step1,
			A2(
				$elm$core$Result$map,
				function (x) {
					return _Utils_Tuple3(
						dc,
						$author$project$MicroAgda$Viz$Structures$dimOfCtx(dc),
						x);
				},
				$author$project$MicroAgda$Viz$Process$step0(
					_Utils_Tuple2(tm, dc))));
	});
var $author$project$MicroAgda$Viz$Process$addBordersStep = F5(
	function (dc, n, tm, _v12, n4) {
		return (!_Utils_eq(
			$author$project$MicroAgda$Viz$Structures$dimOfCtx(dc),
			n)) ? $elm$core$Result$Err('dim not matching context') : A2(
			$elm$core$Result$andThen,
			function (x) {
				return _Utils_eq(
					$author$project$MicroAgda$Viz$Structures$dimOfCtx(dc),
					n) ? $elm$core$Result$Ok(x) : $elm$core$Result$Err('dim not matching context');
			},
			A2(
				$elm$core$Result$map,
				function (all) {
					return _Utils_update(
						n4,
						{whole: all});
				},
				A4(
					$author$project$MicroAgda$Viz$Process$combineCell,
					dc,
					n,
					n4.whole,
					function (f) {
						var sf = A2($author$project$Combinatorics$faceToSubFace, n, f);
						return A2(
							$elm$core$Result$andThen,
							function (dcSF) {
								return A2(
									$elm$core$Result$andThen,
									function (ftm) {
										return A2(
											$elm$core$Result$map,
											function (_v13) {
												var _v14 = _v13.c;
												var x = _v14.b;
												return x;
											},
											$author$project$MicroAgda$Viz$Process$drawTerm(
												_Utils_Tuple2(ftm, dcSF)));
									},
									A3($author$project$MicroAgda$Viz$Structures$termFace, dc, f, tm));
							},
							A2($author$project$MicroAgda$Viz$Structures$mkBoundSF, dc, sf));
					})));
	});
var $author$project$MicroAgda$Viz$Process$addMissingDrawings = function (_v4) {
	var dc = _v4.a;
	var n0 = _v4.b;
	var cn4 = _v4.c;
	var missingDrawings = F4(
		function (tm, vName, sides, cap) {
			var missingFaces = A2(
				$elm$core$List$filterMap,
				$elm$core$Tuple$second,
				A2(
					$author$project$Combinatorics$tabulateFaces,
					n0,
					function (f) {
						var _v11 = sides(
							A2($author$project$Combinatorics$faceToSubFace, n0, f));
						if (_v11.$ === 'Just') {
							return $elm$core$Maybe$Nothing;
						} else {
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									f,
									A2($author$project$Combinatorics$faceToSubFace, n0, f)));
						}
					}));
			var makeMissingN4s = function (_v10) {
				var f = _v10.a;
				var sf = _v10.b;
				return A2(
					$elm$core$Result$andThen,
					function (dcSF) {
						return A2(
							$elm$core$Result$andThen,
							function (ftm) {
								return A2(
									$elm$core$Result$map,
									function (_v8) {
										var _v9 = _v8.c;
										var x = _v9.b;
										return _Utils_Tuple2(
											sf,
											A2(
												$author$project$MicroAgda$Viz$Structures$Cub,
												ftm,
												{whole: x}));
									},
									$author$project$MicroAgda$Viz$Process$drawTerm(
										_Utils_Tuple2(ftm, dcSF)));
							},
							A3($author$project$MicroAgda$Viz$Structures$termFace, dc, f, tm));
					},
					A2($author$project$MicroAgda$Viz$Structures$mkBoundSF, dc, sf));
			};
			return A2($author$project$ResultExtra$mapListResult, makeMissingN4s, missingFaces);
		});
	var addMD = F3(
		function (dcSF, nn, x) {
			return A2(
				$elm$core$Result$map,
				function (_v7) {
					var y = _v7.c;
					return y;
				},
				$author$project$MicroAgda$Viz$Process$addMissingDrawings(
					_Utils_Tuple3(dcSF, nn, x)));
		});
	if (cn4.$ === 'Cub') {
		var tm = cn4.a;
		var x = cn4.b;
		return $elm$core$Result$Ok(
			_Utils_Tuple3(dc, n0, cn4));
	} else {
		var tm = cn4.a;
		var vName = cn4.b;
		var sides = cn4.c;
		var cap = cn4.d;
		var sidesFilled = A2(
			$author$project$ResultExtra$mapListResult,
			function (_v6) {
				var sf = _v6.a;
				var xx = _v6.b;
				return A2(
					$elm$core$Result$map,
					$elm$core$Tuple$pair(sf),
					A2(
						$elm$core$Result$andThen,
						function (dcSF) {
							return A3(
								addMD,
								dcSF,
								$author$project$Combinatorics$getSubFaceDim(sf) + 1,
								xx);
						},
						A3($author$project$MicroAgda$Viz$Structures$subfaceCtx, dc, vName, sf)));
			},
			A2($author$project$Combinatorics$tabulateSubFaces, n0, sides));
		var missFcs = A2(
			$author$project$MicroAgda$Viz$Structures$describeErr,
			'missDrw',
			A4(missingDrawings, tm, vName, sides, cap));
		var combinedSides = A2(
			$elm$core$Result$map,
			$author$project$Combinatorics$makeFnSubFace,
			A3(
				$elm$core$Basics$apR,
				missFcs,
				$elm$core$Result$map2($elm$core$List$append),
				sidesFilled));
		var capFilled = A3(addMD, dc, n0, cap);
		return A2(
			$elm$core$Result$map,
			function (x) {
				return _Utils_Tuple3(dc, n0, x);
			},
			A3(
				$elm$core$Basics$apR,
				combinedSides,
				$elm$core$Result$map2(
					A2($author$project$MicroAgda$Viz$Structures$Hcomp, tm, vName)),
				capFilled));
	}
};
var $author$project$MicroAgda$Viz$Process$drawTerm = function (_v0) {
	var tm = _v0.a;
	var dc0 = _v0.b;
	return A2(
		$elm$core$Result$andThen,
		function (_v1) {
			var dc = _v1.a;
			var n = _v1.b;
			var cn2 = _v1.c;
			return A2(
				$elm$core$Result$map,
				function (_v3) {
					var dcc = _v3.a;
					var nn = _v3.b;
					var x = _v3.c;
					return _Utils_Tuple3(
						dcc,
						nn,
						_Utils_Tuple2(cn2, x));
				},
				A2(
					$elm$core$Result$andThen,
					$author$project$MicroAgda$Viz$Process$combineCells,
					A2(
						$elm$core$Result$map,
						function (_v2) {
							var dcc = _v2.a;
							var nn = _v2.b;
							var x = _v2.c;
							return _Utils_Tuple3(
								dcc,
								nn,
								$author$project$MicroAgda$Viz$Process$fixOrientation(
									_Utils_Tuple2(nn, x)));
						},
						A2(
							$elm$core$Result$andThen,
							$author$project$MicroAgda$Viz$Process$addMissingDrawings,
							A2(
								$author$project$MicroAgda$Viz$Structures$stepMap,
								$author$project$MicroAgda$Viz$Process$addBordersStep,
								A2(
									$author$project$MicroAgda$Viz$Structures$stepMap,
									$author$project$MicroAgda$Viz$Process$piecesCombineStep,
									A2(
										$author$project$MicroAgda$Viz$Structures$stepMap,
										$author$project$MicroAgda$Viz$Process$drawInsidePiecesStep,
										$elm$core$Result$Ok(
											_Utils_Tuple3(dc, n, cn2)))))))));
		},
		A2($author$project$MicroAgda$Viz$Process$tm2Cub, dc0, tm));
};
var $author$project$MicroAgda$Viz$Structures$emptyCtx = {
	bounds: $elm$core$Dict$empty,
	list: _List_Nil,
	uniqs: $author$project$ResultExtra$const(0),
	uniqsPc: $author$project$ResultExtra$const(0)
};
var $author$project$MicroAgda$Viz$Structures$ECSet = function (a) {
	return {$: 'ECSet', a: a};
};
var $author$project$MicroAgda$Viz$Structures$addOn = F4(
	function (i, x, f, j) {
		return _Utils_eq(i, j) ? (f(j) + x) : f(j);
	});
var $author$project$MicroAgda$Internal$Ctx$arity = function (x) {
	var _v0 = $author$project$MicroAgda$Internal$Term$toPiData(
		$author$project$MicroAgda$Internal$Ctx$toTm(x));
	if (_v0.$ === 'Just') {
		var _v1 = _v0.a;
		var _do = _v1.a;
		var cod = _v1.b;
		var _v2 = _Utils_Tuple2(_do.unDom, cod.unAbs);
		if ((((_v2.a.$ === 'Def') && (_v2.a.a.$ === 'BuildIn')) && (_v2.a.a.a.$ === 'Interval')) && (!_v2.a.b.b)) {
			var _v3 = _v2.a;
			var _v4 = _v3.a.a;
			var y = _v2.b;
			return A2(
				$elm$core$Maybe$map,
				function (z) {
					return z + 1;
				},
				$author$project$MicroAgda$Internal$Ctx$arity(
					$author$project$MicroAgda$Internal$Ctx$CT(y)));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	} else {
		var _v5 = $author$project$MicroAgda$Internal$Ctx$toTm(x);
		_v5$2:
		while (true) {
			switch (_v5.$) {
				case 'Def':
					if ((_v5.a.$ === 'FromContext') && (!_v5.b.b)) {
						return $elm$core$Maybe$Just(0);
					} else {
						break _v5$2;
					}
				case 'Var':
					if (!_v5.b.b) {
						return $elm$core$Maybe$Just(0);
					} else {
						break _v5$2;
					}
				default:
					break _v5$2;
			}
		}
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$MicroAgda$Viz$Structures$cuTyCorner = F2(
	function (ct, ss) {
		var n = A2($author$project$Combinatorics$lengthLI, $author$project$Combinatorics$subsetLI, ss);
		var l = $author$project$Combinatorics$subsetLI.toL(ss);
		return A2(
			$elm$core$Result$andThen,
			function (art) {
				if (!_Utils_eq(art, n)) {
					return $elm$core$Result$Err('order of face bigger than arity');
				} else {
					var _v0 = _Utils_Tuple3(
						$author$project$MicroAgda$Internal$Term$tmBIView(
							$author$project$MicroAgda$Internal$Ctx$toTm(ct)),
						art,
						l);
					if (!_v0.c.b) {
						return $elm$core$Result$Err('not a path type!');
					} else {
						if (!_v0.b) {
							return $elm$core$Result$Err('not a path type!');
						} else {
							if (((((_v0.a.$ === 'JB4') && (_v0.a.a.$ === 'PathP')) && (_v0.a.c.$ === 'JT')) && (_v0.a.d.$ === 'JT')) && (_v0.a.e.$ === 'JT')) {
								var _v1 = _v0.a;
								var _v2 = _v1.a;
								var pth = _v1.c.a;
								var end0 = _v1.d.a;
								var end1 = _v1.e.a;
								var _v3 = _v0.c;
								var b = _v3.a;
								var tl = _v3.b;
								if (!tl.b) {
									return $elm$core$Result$Ok(
										A3($author$project$ResultExtra$choose, b, end0, end1));
								} else {
									return A2(
										$elm$core$Result$andThen,
										function (x) {
											return A2(
												$author$project$MicroAgda$Viz$Structures$cuTyCorner,
												$author$project$MicroAgda$Internal$Ctx$CT(x),
												$author$project$Combinatorics$subsetLI.fromL(tl));
										},
										A2(
											$author$project$MicroAgda$Internal$Term$mkApp,
											pth,
											$author$project$MicroAgda$Internal$Term$mkIEnd(b)));
								}
							} else {
								return $elm$core$Result$Err('not a path type!');
							}
						}
					}
				}
			},
			A2(
				$elm$core$Result$fromMaybe,
				'arity not detteceted',
				$author$project$MicroAgda$Internal$Ctx$arity(ct)));
	});
var $author$project$MicroAgda$Viz$Structures$toPoint = F2(
	function (dc, tm) {
		if (((tm.$ === 'Def') && (tm.a.$ === 'FromContext')) && (!tm.b.b)) {
			var i = tm.a.a;
			var _v1 = A2($author$project$MicroAgda$Viz$Structures$lookInside, dc, i);
			if (_v1.$ === 'Ok') {
				if (!_v1.a.a) {
					var _v2 = _v1.a;
					var f = _v2.b;
					return $elm$core$Result$Ok(
						f(
							A2($author$project$Combinatorics$Subset, 0, 0)).b);
				} else {
					return $elm$core$Result$Err('not a point');
				}
			} else {
				var e = _v1.a;
				return $elm$core$Result$Err(e);
			}
		} else {
			return $elm$core$Result$Err('not a point');
		}
	});
var $author$project$MicroAgda$Viz$Structures$cuTyCornerColorId = F2(
	function (dc, ct) {
		return A2(
			$elm$core$Result$andThen,
			function (arr) {
				return A2(
					$author$project$MicroAgda$Viz$Structures$describeErr,
					'cuTyCornerColorId',
					A2(
						$elm$core$Result$map,
						$author$project$ResultExtra$postcompose(
							$elm$core$Maybe$withDefault(-1)),
						A2(
							$elm$core$Result$map,
							$author$project$Combinatorics$makeFnLI($author$project$Combinatorics$subsetLI),
							A2(
								$author$project$ResultExtra$mapListResult,
								$elm$core$Basics$identity,
								A3(
									$author$project$Combinatorics$mapAllLI,
									$author$project$Combinatorics$subsetLI,
									arr,
									function (ss) {
										return A2(
											$elm$core$Result$map,
											$elm$core$Tuple$pair(ss),
											A2(
												$elm$core$Result$andThen,
												$author$project$MicroAgda$Viz$Structures$toPoint(dc),
												A2($author$project$MicroAgda$Viz$Structures$cuTyCorner, ct, ss)));
									})))));
			},
			A2(
				$elm$core$Result$fromMaybe,
				'arity not detteceted',
				$author$project$MicroAgda$Internal$Ctx$arity(ct)));
	});
var $author$project$MicroAgda$Viz$Structures$genCub = F2(
	function (dc, ct) {
		return A2(
			$author$project$MicroAgda$Viz$Structures$describeErr,
			'inGenCub',
			function () {
				var _v0 = _Utils_Tuple2(
					$author$project$MicroAgda$Internal$Term$tmBIView(
						$author$project$MicroAgda$Internal$Ctx$toTm(ct)),
					$author$project$MicroAgda$Internal$Ctx$arity(ct));
				if (_v0.b.$ === 'Just') {
					if (!_v0.b.a) {
						var freshColorId = dc.uniqs(0);
						return $elm$core$Result$Ok(
							$elm$core$Maybe$Just(
								_Utils_Tuple2(
									_Utils_Tuple2(
										0,
										$author$project$ResultExtra$const(
											_Utils_Tuple2(
												_Utils_Tuple2(0, 0),
												freshColorId))),
									_Utils_Tuple2(
										A3($author$project$MicroAgda$Viz$Structures$addOn, 0, 1, dc.uniqs),
										dc.uniqsPc))));
					} else {
						var n = _v0.b.a;
						return A2(
							$elm$core$Result$map,
							function (corF) {
								return $elm$core$Maybe$Just(
									function () {
										var _v1 = A2(
											$elm$core$Tuple$mapFirst,
											A2(
												$elm$core$Basics$composeR,
												$author$project$Combinatorics$makeFnLI($author$project$Combinatorics$subsetLI),
												$author$project$ResultExtra$postcompose(
													$elm$core$Maybe$withDefault(
														_Utils_Tuple2(
															_Utils_Tuple2(-1, -1),
															-1)))),
											A3(
												$elm$core$List$foldr,
												function (_v2) {
													var corn = _v2.a;
													var cc = _v2.b;
													return function (_v3) {
														var l = _v3.a;
														var upc = _v3.b;
														return _Utils_Tuple2(
															A2(
																$elm$core$List$cons,
																_Utils_Tuple2(
																	corn,
																	_Utils_Tuple2(
																		_Utils_Tuple2(
																			$author$project$Combinatorics$subsetLI.toI(corn) + dc.uniqs(n),
																			upc(
																				corF(corn))),
																		corF(corn))),
																l),
															A3($author$project$MicroAgda$Viz$Structures$addOn, cc, 1, upc));
													};
												},
												_Utils_Tuple2(_List_Nil, dc.uniqsPc),
												A3(
													$author$project$Combinatorics$mapAllLI,
													$author$project$Combinatorics$subsetLI,
													n,
													function (x) {
														return _Utils_Tuple2(
															x,
															corF(x));
													})));
										var ins = _v1.a;
										var upc2 = _v1.b;
										return _Utils_Tuple2(
											_Utils_Tuple2(n, ins),
											_Utils_Tuple2(
												A3(
													$author$project$MicroAgda$Viz$Structures$addOn,
													n,
													A2($elm$core$Basics$pow, 2, n),
													dc.uniqs),
												upc2));
									}());
							},
							A2($author$project$MicroAgda$Viz$Structures$cuTyCornerColorId, dc, ct));
					}
				} else {
					return $elm$core$Result$Ok($elm$core$Maybe$Nothing);
				}
			}());
	});
var $author$project$ResultExtra$maybeTry = function (x) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$Maybe$map($elm$core$Maybe$Just),
		$elm$core$Maybe$withDefault(x));
};
var $author$project$MicroAgda$Viz$Structures$mbDim = F2(
	function (dc, _v0) {
		var ty = _v0.a;
		if ((((ty.$ === 'Def') && (ty.a.$ === 'BuildIn')) && (ty.a.a.$ === 'Interval')) && (!ty.b.b)) {
			var _v2 = ty.a.a;
			return $elm$core$Maybe$Just(
				$author$project$MicroAgda$Viz$Structures$dimOfCtx(dc));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$ResultExtra$resMixMaybe = function (r) {
	if (r.$ === 'Err') {
		var e = r.a;
		return $elm$core$Maybe$Just(
			$elm$core$Result$Err(e));
	} else {
		if (r.a.$ === 'Nothing') {
			var _v1 = r.a;
			return $elm$core$Maybe$Nothing;
		} else {
			var x = r.a.a;
			return $elm$core$Maybe$Just(
				$elm$core$Result$Ok(x));
		}
	}
};
var $author$project$MicroAgda$Viz$Structures$generate = F2(
	function (dc, ct) {
		return $author$project$ResultExtra$maybeMixRes(
			A2(
				$author$project$ResultExtra$maybeTry,
				A2(
					$elm$core$Maybe$map,
					$elm$core$Result$map(
						$elm$core$Tuple$mapFirst($author$project$MicroAgda$Viz$Structures$ECSet)),
					$author$project$ResultExtra$resMixMaybe(
						A2($author$project$MicroAgda$Viz$Structures$genCub, dc, ct))),
				A2(
					$elm$core$Maybe$map,
					function (_v0) {
						return $elm$core$Result$Ok(
							_Utils_Tuple2(
								$author$project$MicroAgda$Viz$Structures$EInterval,
								_Utils_Tuple2(dc.uniqs, dc.uniqsPc)));
					},
					A2($author$project$MicroAgda$Viz$Structures$mbDim, dc, ct))));
	});
var $author$project$MicroAgda$Viz$Structures$extend = F3(
	function (vName, dc, ct) {
		return A2(
			$author$project$MicroAgda$Viz$Structures$describeErr,
			'In extend:',
			A2(
				$elm$core$Result$andThen,
				function (gn) {
					if (gn.$ === 'Just') {
						var _v1 = gn.a;
						var g = _v1.a;
						var _v2 = _v1.b;
						var u = _v2.a;
						var uPc = _v2.b;
						return $elm$core$Result$Ok(
							_Utils_update(
								dc,
								{
									list: A2(
										$elm$core$List$cons,
										_Utils_Tuple3(
											vName,
											ct,
											$elm$core$Maybe$Just(g)),
										dc.list),
									uniqs: u,
									uniqsPc: uPc
								}));
					} else {
						return $elm$core$Result$Ok(
							_Utils_update(
								dc,
								{
									list: A2(
										$elm$core$List$cons,
										_Utils_Tuple3(vName, ct, $elm$core$Maybe$Nothing),
										dc.list)
								}));
					}
				},
				A2($author$project$MicroAgda$Viz$Structures$generate, dc, ct)));
	});
var $author$project$ResultExtra$resultPairR = function (_v0) {
	var a = _v0.a;
	var rbc = _v0.b;
	return A2(
		$elm$core$Result$map,
		$elm$core$Tuple$pair(a),
		rbc);
};
var $author$project$MicroAgda$Viz$Process$makeDrawCtx = function (_v0) {
	var ct0 = _v0.a;
	var tm0 = _v0.b;
	return A2(
		$elm$core$Result$map,
		function (_v6) {
			var _v7 = _v6.a;
			var t = _v7.b;
			var c = _v6.b;
			return _Utils_Tuple2(t, c);
		},
		A2(
			$author$project$ResultExtra$maybeLoop,
			A2(
				$author$project$ResultExtra$convergeResult,
				function (_v1) {
					return $elm$core$Maybe$Nothing;
				},
				function (_v2) {
					var _v3 = _v2.a;
					var ct = _v3.a;
					var tm = _v3.b;
					var dc = _v2.b;
					return A2(
						$elm$core$Maybe$map,
						function (_v4) {
							var _do = _v4.a;
							var bo = _v4.b;
							return A2(
								$elm$core$Result$andThen,
								function (tyTm) {
									if (tm.$ === 'Lam') {
										var tmAbs = tm.b;
										return A2(
											$elm$core$Result$andThen,
											function (nTm) {
												return $author$project$ResultExtra$resultPairR(
													_Utils_Tuple2(
														_Utils_Tuple2(
															$author$project$MicroAgda$Internal$Ctx$CT(tyTm),
															nTm),
														A3(
															$author$project$MicroAgda$Viz$Structures$extend,
															tmAbs.absName,
															dc,
															$author$project$MicroAgda$Internal$Ctx$CT(_do.unDom))));
											},
											A2(
												$author$project$MicroAgda$Internal$Term$mkApp,
												tm,
												$author$project$MicroAgda$Internal$Term$ctxVar(
													$elm$core$List$length(dc.list))));
									} else {
										return $elm$core$Result$Err('not a lambda');
									}
								},
								A2(
									$author$project$MicroAgda$Internal$Term$absApply,
									bo,
									A2(
										$author$project$MicroAgda$Internal$Term$Def,
										$author$project$MicroAgda$Internal$Term$FromContext(
											$elm$core$List$length(dc.list)),
										_List_Nil)));
						},
						$author$project$MicroAgda$Internal$Term$toPiData(
							$author$project$MicroAgda$Internal$Ctx$toTm(ct)));
				}),
			$elm$core$Result$Ok(
				_Utils_Tuple2(
					_Utils_Tuple2(ct0, tm0),
					$author$project$MicroAgda$Viz$Structures$emptyCtx))));
};
var $author$project$MicroAgda$Viz$Process$allWork = A2(
	$elm$core$Basics$composeR,
	$author$project$MicroAgda$Viz$Process$makeDrawCtx,
	$elm$core$Result$andThen($author$project$MicroAgda$Viz$Process$drawTerm));
var $elm$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 'Nothing') {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 'Nothing') {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return $elm$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var $rtfeldman$elm_css$Css$paddingLeft = $rtfeldman$elm_css$Css$prop1('padding-left');
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $rtfeldman$elm_css$Html$Styled$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $author$project$MicroAgda$Viz$CodeViz$selectEvent = function (adrs) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$Events$stopPropagationOn,
		'click',
		$elm$json$Json$Decode$succeed(
			_Utils_Tuple2(
				$elm$core$Maybe$Just(adrs),
				true)));
};
var $rtfeldman$elm_css$Css$backgroundColor = function (c) {
	return A2($rtfeldman$elm_css$Css$property, 'background-color', c.value);
};
var $rtfeldman$elm_css$Css$cssFunction = F2(
	function (funcName, args) {
		return funcName + ('(' + (A2($elm$core$String$join, ', ', args) + ')'));
	});
var $rtfeldman$elm_css$Css$rgb = F3(
	function (r, g, b) {
		return {
			alpha: 1,
			blue: b,
			color: $rtfeldman$elm_css$Css$Structure$Compatible,
			green: g,
			red: r,
			value: A2(
				$rtfeldman$elm_css$Css$cssFunction,
				'rgb',
				A2(
					$elm$core$List$map,
					$elm$core$String$fromInt,
					_List_fromArray(
						[r, g, b])))
		};
	});
var $author$project$MicroAgda$Viz$CodeViz$selectedStyle = F2(
	function (mbAddr, addr) {
		return _Utils_ap(
			_Utils_eq(
				mbAddr,
				$elm$core$Maybe$Just(addr)) ? _List_fromArray(
				[
					$rtfeldman$elm_css$Css$backgroundColor(
					A3($rtfeldman$elm_css$Css$rgb, 220, 220, 220))
				]) : _List_Nil,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer)
				]));
	});
var $author$project$MicroAgda$Viz$CodeViz$selectable = F4(
	function (mbAdr, adrs, s, elems) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_Utils_ap(
				_List_fromArray(
					[
						$author$project$MicroAgda$Viz$CodeViz$selectEvent(adrs),
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						A2($author$project$MicroAgda$Viz$CodeViz$selectedStyle, mbAdr, adrs))
					]),
				s),
			elems);
	});
var $author$project$MicroAgda$Viz$Structures$toCtx = function (dc) {
	return A2(
		$elm$core$List$map,
		function (_v0) {
			var s = _v0.a;
			var ct = _v0.b;
			return _Utils_Tuple2(
				_Utils_Tuple2(s, ct),
				$elm$core$Maybe$Nothing);
		},
		dc.list);
};
var $rtfeldman$elm_css$Css$top = $rtfeldman$elm_css$Css$prop1('top');
var $rtfeldman$elm_css$Css$Preprocess$ApplyStyles = function (a) {
	return {$: 'ApplyStyles', a: a};
};
var $rtfeldman$elm_css$Css$Internal$property = F2(
	function (key, value) {
		return $rtfeldman$elm_css$Css$Preprocess$AppendProperty(key + (':' + value));
	});
var $rtfeldman$elm_css$Css$Internal$getOverloadedProperty = F3(
	function (functionName, desiredKey, style) {
		getOverloadedProperty:
		while (true) {
			switch (style.$) {
				case 'AppendProperty':
					var str = style.a;
					var key = A2(
						$elm$core$Maybe$withDefault,
						'',
						$elm$core$List$head(
							A2($elm$core$String$split, ':', str)));
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, key);
				case 'ExtendSelector':
					var selector = style.a;
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-selector'));
				case 'NestSnippet':
					var combinator = style.a;
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-combinator'));
				case 'WithPseudoElement':
					var pseudoElement = style.a;
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-pseudo-element setter'));
				case 'WithMedia':
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-media-query'));
				case 'WithKeyframes':
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-keyframes'));
				default:
					if (!style.a.b) {
						return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-empty-Style'));
					} else {
						if (!style.a.b.b) {
							var _v1 = style.a;
							var only = _v1.a;
							var $temp$functionName = functionName,
								$temp$desiredKey = desiredKey,
								$temp$style = only;
							functionName = $temp$functionName;
							desiredKey = $temp$desiredKey;
							style = $temp$style;
							continue getOverloadedProperty;
						} else {
							var _v2 = style.a;
							var first = _v2.a;
							var rest = _v2.b;
							var $temp$functionName = functionName,
								$temp$desiredKey = desiredKey,
								$temp$style = $rtfeldman$elm_css$Css$Preprocess$ApplyStyles(rest);
							functionName = $temp$functionName;
							desiredKey = $temp$desiredKey;
							style = $temp$style;
							continue getOverloadedProperty;
						}
					}
			}
		}
	});
var $rtfeldman$elm_css$Css$Internal$IncompatibleUnits = {$: 'IncompatibleUnits'};
var $rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty = A3($rtfeldman$elm_css$Css$Internal$lengthConverter, $rtfeldman$elm_css$Css$Internal$IncompatibleUnits, '', 0);
var $rtfeldman$elm_css$Css$verticalAlign = function (fn) {
	return A3(
		$rtfeldman$elm_css$Css$Internal$getOverloadedProperty,
		'verticalAlign',
		'vertical-align',
		fn($rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
};
var $author$project$MicroAgda$Viz$CodeViz$collectCubHtml = F3(
	function (mba, adrs, _v0) {
		var dc = _v0.a;
		var n = _v0.b;
		var cH = _v0.c;
		var hcompSubFaceDescCss = $rtfeldman$elm_css$Html$Styled$Attributes$css(
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$inlineBlock),
					$rtfeldman$elm_css$Css$verticalAlign($rtfeldman$elm_css$Css$top)
				]));
		var sf2Str = function (sf) {
			return A2(
				$rtfeldman$elm_css$Html$Styled$div,
				_List_fromArray(
					[hcompSubFaceDescCss]),
				$elm$core$List$singleton(
					$rtfeldman$elm_css$Html$Styled$text(
						function (x) {
							return x + ' → ';
						}(
							A2(
								$elm$core$String$join,
								'',
								A2(
									$elm$core$List$map,
									function (_v3) {
										var _v4 = _v3.a;
										var name = _v4.a;
										var i = _v4.b;
										var b = _v3.b;
										return '(' + (name + (' = ' + (A3($author$project$ResultExtra$choose, b, 'i0', 'i1') + ')')));
									},
									A2(
										$elm$core$List$filterMap,
										$elm$core$Basics$identity,
										A2(
											$elm$core$List$indexedMap,
											function (x) {
												return function (mb) {
													return A3(
														$elm$core$Maybe$map2,
														function (b) {
															return function (name) {
																return _Utils_Tuple2(
																	_Utils_Tuple2(name, x),
																	b);
															};
														},
														mb,
														A2(
															$author$project$MicroAgda$Internal$Ctx$lookNameByInt,
															$author$project$MicroAgda$Viz$Structures$toCtx(dc),
															A2(
																$author$project$MicroAgda$Viz$Structures$fromDimIndex,
																dc,
																$author$project$MicroAgda$Viz$Structures$DimIndex(x))));
												};
											},
											$author$project$Combinatorics$subFaceLI.toL(sf)))))))));
		};
		var hcompSubFaceBodyCss = $rtfeldman$elm_css$Html$Styled$Attributes$css(
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$inlineBlock)
				]));
		var sfHtml = F3(
			function (vName, sf, sideBody) {
				return A2(
					$elm$core$Result$withDefault,
					$rtfeldman$elm_css$Html$Styled$text('printingCodeErr'),
					A2(
						$elm$core$Result$map,
						function (dc2) {
							var dc3 = A2($author$project$MicroAgda$Viz$Structures$extendI, dc2, vName);
							var n3 = $author$project$MicroAgda$Viz$Structures$dimOfCtx(dc3);
							return A4(
								$author$project$MicroAgda$Viz$CodeViz$selectable,
								mba,
								_Utils_ap(
									adrs,
									_List_fromArray(
										[sf])),
								_List_fromArray(
									[
										$rtfeldman$elm_css$Html$Styled$Attributes$css(_List_Nil)
									]),
								_List_fromArray(
									[
										sf2Str(sf),
										A2(
										$rtfeldman$elm_css$Html$Styled$div,
										_List_fromArray(
											[hcompSubFaceBodyCss]),
										_List_fromArray(
											[
												A3(
												$author$project$MicroAgda$Viz$CodeViz$collectCubHtml,
												mba,
												_Utils_ap(
													adrs,
													_List_fromArray(
														[sf])),
												_Utils_Tuple3(dc3, n3, sideBody))
											]))
									]));
						},
						A2($author$project$MicroAgda$Viz$Structures$mkBoundSF, dc, sf)));
			});
		var hcompSidesCss = $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_Nil);
		var hcompInsideCss = $rtfeldman$elm_css$Html$Styled$Attributes$css(
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$paddingLeft(
					$rtfeldman$elm_css$Css$px(10))
				]));
		var hcompHeadCss = $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_Nil);
		var hcompCupCss = $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_Nil);
		if (cH.$ === 'Cub') {
			var tm = cH.a;
			var x = cH.b;
			return A2(
				$rtfeldman$elm_css$Html$Styled$map,
				$author$project$ResultExtra$const($elm$core$Maybe$Nothing),
				x);
		} else {
			var tm = cH.a;
			var vName = cH.b;
			var sides = cH.c;
			var cup = cH.d;
			var sidesHtml = A2(
				$elm$core$List$map,
				function (_v2) {
					var sf = _v2.a;
					var bd = _v2.b;
					return A3(sfHtml, vName, sf, bd);
				},
				A2($author$project$Combinatorics$tabulateSubFaces, n, sides));
			return A4(
				$author$project$MicroAgda$Viz$CodeViz$selectable,
				mba,
				adrs,
				_List_Nil,
				_Utils_ap(
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$div,
							_List_fromArray(
								[hcompHeadCss]),
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('hcomp (λ ' + (vName + ' → λ { '))
								]))
						]),
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$div,
							_List_fromArray(
								[hcompInsideCss]),
							_Utils_ap(
								_List_fromArray(
									[
										A2(
										$rtfeldman$elm_css$Html$Styled$div,
										_List_fromArray(
											[hcompSidesCss]),
										sidesHtml)
									]),
								_Utils_ap(
									_List_fromArray(
										[
											A2(
											$rtfeldman$elm_css$Html$Styled$div,
											_List_Nil,
											_List_fromArray(
												[
													$rtfeldman$elm_css$Html$Styled$text('})')
												]))
										]),
									_List_fromArray(
										[
											A4(
											$author$project$MicroAgda$Viz$CodeViz$selectable,
											mba,
											_Utils_ap(
												adrs,
												_List_fromArray(
													[
														$author$project$Combinatorics$subFaceCenter(n)
													])),
											_List_fromArray(
												[hcompCupCss]),
											_List_fromArray(
												[
													A3(
													$author$project$MicroAgda$Viz$CodeViz$collectCubHtml,
													mba,
													_Utils_ap(
														adrs,
														_List_fromArray(
															[
																$author$project$Combinatorics$subFaceCenter(n)
															])),
													_Utils_Tuple3(dc, n, cup))
												]))
										]))))
						])));
		}
	});
var $rtfeldman$elm_css$Css$fontFamily = $rtfeldman$elm_css$Css$prop1('font-family');
var $author$project$MicroAgda$TypeChecker$describeErr = function (s) {
	return $elm$core$Result$mapError(
		function (e) {
			return s + (' \n' + A2($author$project$MicroAgda$StringTools$indent, 4, e));
		});
};
var $author$project$MicroAgda$StringTools$makeFreshList = F2(
	function (ls0, ss0) {
		return $elm$core$List$reverse(
			A3(
				$elm$core$List$foldl,
				function (name) {
					return function (_v0) {
						var ls = _v0.a;
						var ss = _v0.b;
						var _new = A2($author$project$MicroAgda$StringTools$makeFresh, name, ss);
						return _Utils_Tuple2(
							A2($elm$core$List$cons, _new, ls),
							A2($elm$core$Set$insert, name, ss));
					};
				},
				_Utils_Tuple2(_List_Nil, ss0),
				ls0).a);
	});
var $author$project$ResultExtra$padRight = F3(
	function (n, x, l) {
		var _v0 = A2(
			$elm$core$Basics$compare,
			n,
			$elm$core$List$length(l));
		switch (_v0.$) {
			case 'EQ':
				return l;
			case 'LT':
				return A2($elm$core$List$take, n, l);
			default:
				return _Utils_ap(
					l,
					A2(
						$elm$core$List$repeat,
						n - $elm$core$List$length(l),
						x));
		}
	});
var $author$project$MicroAgda$Internal$Ctx$extendInth = F2(
	function (k, c) {
		var ss = A2(
			$elm$core$Set$union,
			$author$project$MicroAgda$Internal$Term$buildInNamesSet,
			$author$project$MicroAgda$Internal$Ctx$symbolsSet(c));
		var names = A2(
			$author$project$MicroAgda$StringTools$makeFreshList,
			A3(
				$author$project$ResultExtra$padRight,
				k,
				'i',
				A2($elm$core$String$split, '', 'ijkl')),
			ss);
		return A2(
			$author$project$ResultExtra$pairR,
			names,
			A3(
				$elm$core$List$foldl,
				function (name) {
					return A2(
						$author$project$ResultExtra$swapFn,
						A2($author$project$ResultExtra$swapFn, $author$project$MicroAgda$Internal$Ctx$extend, name),
						$author$project$MicroAgda$Internal$Ctx$CT($author$project$MicroAgda$Internal$Term$mkInterval));
				},
				c,
				names));
	});
var $author$project$MicroAgda$TypeChecker$getBaseType = function (ct) {
	return A2(
		$author$project$MicroAgda$TypeChecker$describeErr,
		'getBaseType : ',
		A2(
			$elm$core$Result$andThen,
			function (art) {
				var _v0 = _Utils_Tuple2(
					$author$project$MicroAgda$Internal$Term$tmBIView(
						$author$project$MicroAgda$Internal$Ctx$toTm(ct)),
					art);
				if (((((_v0.a.$ === 'JB4') && (_v0.a.a.$ === 'PathP')) && (_v0.a.c.$ === 'JT')) && (_v0.a.d.$ === 'JT')) && (_v0.a.e.$ === 'JT')) {
					if (_v0.b === 1) {
						var _v1 = _v0.a;
						var _v2 = _v1.a;
						var pth = _v1.c.a;
						var end0 = _v1.d.a;
						var end1 = _v1.e.a;
						return A2(
							$elm$core$Result$map,
							$author$project$MicroAgda$Internal$Ctx$CT,
							A2(
								$author$project$MicroAgda$Internal$Term$mkApp,
								pth,
								$author$project$MicroAgda$Internal$Term$mkIEnd(true)));
					} else {
						var _v3 = _v0.a;
						var _v4 = _v3.a;
						var pth = _v3.c.a;
						var end0 = _v3.d.a;
						var end1 = _v3.e.a;
						var k = _v0.b;
						return A2(
							$elm$core$Result$andThen,
							$author$project$MicroAgda$TypeChecker$getBaseType,
							A2(
								$elm$core$Result$map,
								$author$project$MicroAgda$Internal$Ctx$CT,
								A2(
									$author$project$MicroAgda$Internal$Term$mkApp,
									pth,
									$author$project$MicroAgda$Internal$Term$mkIEnd(true))));
					}
				} else {
					return $elm$core$Result$Err(
						'not a path type! (' + ($elm$core$String$fromInt(art) + ')'));
				}
			},
			A2(
				$elm$core$Result$fromMaybe,
				'arity not detteceted',
				$author$project$MicroAgda$Internal$Ctx$arity(ct))));
};
var $author$project$MicroAgda$TypeChecker$cuTyFace = F3(
	function (c, ct, _v0) {
		var i = _v0.a;
		var b = _v0.b;
		return A2(
			$author$project$MicroAgda$TypeChecker$describeErr,
			'cuTyFace : ',
			A2(
				$elm$core$Result$andThen,
				function (na) {
					if (_Utils_cmp(na, i) < 1) {
						return $elm$core$Result$Err('face index to big for this arity');
					} else {
						var c2 = A3($author$project$MicroAgda$Internal$Ctx$extend, c, 'cuTyFaceTemp', ct);
						var _v1 = A2($author$project$MicroAgda$Internal$Ctx$extendInth, na - 1, c2);
						var c3 = _v1.a;
						var dimNames = _v1.b;
						return A2(
							$elm$core$Result$andThen,
							function (bct) {
								var rtm = A3(
									$elm$core$List$foldl,
									function (name) {
										return function (rawTerm) {
											return A2(
												$author$project$MicroAgda$Raw$App,
												rawTerm,
												$author$project$MicroAgda$Raw$Var(name));
										};
									},
									$author$project$MicroAgda$Raw$Var('cuTyFaceTemp'),
									A3(
										$author$project$ResultExtra$listInsert,
										i,
										A3($author$project$ResultExtra$choose, b, 'i0', 'i1'),
										dimNames));
								return A2(
									$author$project$MicroAgda$TypeChecker$describeErr,
									'tc er : ',
									A2(
										$elm$core$Result$map,
										$elm$core$Tuple$second,
										A2(
											$elm$core$Result$map,
											function (ftm) {
												return A2(
													$author$project$MicroAgda$TypeChecker$unTelescope,
													_Utils_Tuple2(c3, ftm),
													dimNames);
											},
											A3($author$project$MicroAgda$TypeChecker$tC, c3, bct, rtm))));
							},
							$author$project$MicroAgda$TypeChecker$getBaseType(ct));
					}
				},
				A2(
					$elm$core$Result$fromMaybe,
					'arity not detteceted',
					$author$project$MicroAgda$Internal$Ctx$arity(ct))));
	});
var $author$project$MicroAgda$Internal$TranslatePretty$newName = F2(
	function (ls, s) {
		return A2(
			$author$project$MicroAgda$StringTools$makeFresh,
			s,
			$elm$core$Set$fromList(ls));
	});
var $author$project$MicroAgda$Internal$TranslatePretty$swap = F3(
	function (f, b, a) {
		return A2(f, a, b);
	});
var $author$project$MicroAgda$Internal$TranslatePretty$foldInternalApp = F2(
	function (c, bnd) {
		return $elm$core$List$foldl(
			A2(
				$elm$core$Basics$composeR,
				$author$project$MicroAgda$Internal$Term$elimArg,
				A2(
					$elm$core$Basics$composeR,
					A2($author$project$MicroAgda$Internal$TranslatePretty$internal2raw, c, bnd),
					$author$project$MicroAgda$Internal$TranslatePretty$swap($author$project$MicroAgda$Raw$App))));
	});
var $author$project$MicroAgda$Internal$TranslatePretty$internal2raw = F3(
	function (c, bnd, t) {
		return A2(
			$elm$core$Maybe$withDefault,
			function () {
				switch (t.$) {
					case 'Pi':
						var dt = t.a;
						var at = t.b;
						var nn = A2($author$project$MicroAgda$Internal$TranslatePretty$newName, bnd, at.absName);
						return A3(
							$author$project$MicroAgda$Raw$Pi,
							nn,
							A3($author$project$MicroAgda$Internal$TranslatePretty$internal2raw, c, bnd, dt.unDom),
							A3(
								$author$project$MicroAgda$Internal$TranslatePretty$internal2raw,
								c,
								A2($elm$core$List$cons, nn, bnd),
								at.unAbs));
					case 'Lam':
						var ai = t.a;
						var at = t.b;
						var nn = A2($author$project$MicroAgda$Internal$TranslatePretty$newName, bnd, at.absName);
						return A2(
							$author$project$MicroAgda$Raw$Lam,
							nn,
							A3(
								$author$project$MicroAgda$Internal$TranslatePretty$internal2raw,
								c,
								A2($elm$core$List$cons, nn, bnd),
								at.unAbs));
					case 'LamP':
						var pcs = t.a;
						var ee = t.b;
						return A4(
							$author$project$MicroAgda$Internal$TranslatePretty$foldInternalApp,
							c,
							bnd,
							$author$project$MicroAgda$Raw$LamP(
								A2(
									$elm$core$List$map,
									function (pc) {
										return _Utils_Tuple2(
											A2(
												$elm$core$List$map,
												function (_v2) {
													var ie = _v2.a;
													var b = _v2.b;
													return _Utils_Tuple2(
														A3($author$project$MicroAgda$Internal$TranslatePretty$internal2raw, c, bnd, ie),
														b);
												},
												pc.subFace),
											A3($author$project$MicroAgda$Internal$TranslatePretty$internal2raw, c, bnd, pc.body));
									},
									pcs)),
							ee);
					case 'Var':
						var j = t.a;
						var ee = t.b;
						return A4(
							$author$project$MicroAgda$Internal$TranslatePretty$foldInternalApp,
							c,
							bnd,
							$author$project$MicroAgda$Raw$Var(
								A2(
									$elm$core$Maybe$withDefault,
									'(INTERNAL ERR! wrng abs level! Translate.elm : ' + ($elm$core$String$fromInt(j) + (' ' + ($author$project$MicroAgda$StringTools$absPreview(bnd) + ')'))),
									A2(
										$elm$core$Maybe$map,
										function (nm) {
											return nm;
										},
										A2($author$project$ResultExtra$lookByIntInList, bnd, j)))),
							ee);
					case 'Def':
						if (t.a.$ === 'FromContext') {
							var j = t.a.a;
							var ee = t.b;
							return A4(
								$author$project$MicroAgda$Internal$TranslatePretty$foldInternalApp,
								c,
								bnd,
								$author$project$MicroAgda$Raw$Var(
									A2(
										$elm$core$Maybe$withDefault,
										'(INTERNAL ERR! not in scope! Translate.elm : ' + ($elm$core$String$fromInt(j) + (' ' + ($author$project$MicroAgda$Internal$Ctx$ctxPreview(c) + ')'))),
										A2($author$project$MicroAgda$Internal$Ctx$lookNameByInt, c, j))),
								ee);
						} else {
							var bi = t.a.a;
							var ee = t.b;
							return A4(
								$author$project$MicroAgda$Internal$TranslatePretty$foldInternalApp,
								c,
								bnd,
								$author$project$MicroAgda$Raw$Var(
									$author$project$MicroAgda$Internal$Term$buildInToken2String(bi)),
								ee);
						}
					default:
						return $author$project$MicroAgda$Raw$Var('TypeInf');
				}
			}(),
			A3($author$project$MicroAgda$Internal$TranslatePretty$pretty, c, bnd, t));
	});
var $author$project$MicroAgda$Internal$TranslatePretty$pretty = F3(
	function (c, bnd, t) {
		return A2(
			$elm$core$Maybe$andThen,
			function (arr) {
				var head = A2(
					$author$project$ResultExtra$lookByIntInList,
					_List_fromArray(
						['_≡_', 'Sq', 'Cu']),
					arr - 1);
				var faces = A2(
					$author$project$ResultExtra$mapListResult,
					A2(
						$elm$core$Basics$composeR,
						A2(
							$author$project$MicroAgda$TypeChecker$cuTyFace,
							c,
							$author$project$MicroAgda$Internal$Ctx$CT(t)),
						$elm$core$Result$map(
							A2($author$project$MicroAgda$Internal$TranslatePretty$internal2raw, c, bnd))),
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(
								(x / 2) | 0,
								A2($elm$core$Basics$modBy, 2, x) === 1);
						},
						A2($elm$core$List$range, 0, (2 * arr) - 1)));
				var _v0 = _Utils_Tuple2(head, faces);
				if ((_v0.a.$ === 'Just') && (_v0.b.$ === 'Ok')) {
					var h = _v0.a.a;
					var fcs = _v0.b.a;
					return $elm$core$Maybe$Just(
						A3(
							$elm$core$List$foldl,
							function (x) {
								return function (rt) {
									return A2($author$project$MicroAgda$Raw$App, rt, x);
								};
							},
							$author$project$MicroAgda$Raw$Var(h),
							fcs));
				} else {
					return $elm$core$Maybe$Nothing;
				}
			},
			$author$project$MicroAgda$Internal$Ctx$arity(
				$author$project$MicroAgda$Internal$Ctx$CT(t)));
	});
var $author$project$MicroAgda$Internal$TranslatePretty$t2str = function (c) {
	return A2(
		$elm$core$Basics$composeR,
		A2($author$project$MicroAgda$Internal$TranslatePretty$internal2raw, c, _List_Nil),
		$author$project$MicroAgda$Raw$raw2String);
};
var $author$project$MicroAgda$Viz$CodeViz$genHtml = F6(
	function (mba, dc, n, tm, addr, n2) {
		var txt = $rtfeldman$elm_css$Html$Styled$text(
			A2(
				$author$project$MicroAgda$Internal$TranslatePretty$t2str,
				$author$project$MicroAgda$Viz$Structures$toCtx(dc),
				tm));
		return $elm$core$Result$Ok(
			A2(
				$rtfeldman$elm_css$Html$Styled$div,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(_List_Nil)
					]),
				_List_fromArray(
					[txt])));
	});
var $rtfeldman$elm_css$Css$monospace = {fontFamily: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'monospace'};
var $rtfeldman$elm_css$Css$padding = $rtfeldman$elm_css$Css$prop1('padding');
var $rtfeldman$elm_css$Css$prop3 = F4(
	function (key, argA, argB, argC) {
		return A2(
			$rtfeldman$elm_css$Css$property,
			key,
			A2(
				$elm$core$String$join,
				' ',
				_List_fromArray(
					[argA.value, argB.value, argC.value])));
	});
var $rtfeldman$elm_css$Css$border3 = $rtfeldman$elm_css$Css$prop3('border');
var $rtfeldman$elm_css$Css$solid = {borderStyle: $rtfeldman$elm_css$Css$Structure$Compatible, textDecorationStyle: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'solid'};
var $rtfeldman$elm_css$Css$fontSize = $rtfeldman$elm_css$Css$prop1('font-size');
var $rtfeldman$elm_css$Css$fontWeight = function (_v0) {
	var value = _v0.value;
	return A2($rtfeldman$elm_css$Css$property, 'font-weight', value);
};
var $rtfeldman$elm_css$Html$Styled$h2 = $rtfeldman$elm_css$Html$Styled$node('h2');
var $rtfeldman$elm_css$Css$prop4 = F5(
	function (key, argA, argB, argC, argD) {
		return A2(
			$rtfeldman$elm_css$Css$property,
			key,
			A2(
				$elm$core$String$join,
				' ',
				_List_fromArray(
					[argA.value, argB.value, argC.value, argD.value])));
	});
var $rtfeldman$elm_css$Css$margin4 = $rtfeldman$elm_css$Css$prop4('margin');
var $rtfeldman$elm_css$Css$normal = {featureTagValue: $rtfeldman$elm_css$Css$Structure$Compatible, fontStyle: $rtfeldman$elm_css$Css$Structure$Compatible, fontWeight: $rtfeldman$elm_css$Css$Structure$Compatible, overflowWrap: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'normal', whiteSpace: $rtfeldman$elm_css$Css$Structure$Compatible};
var $author$project$MicroAgda$Viz$CodeViz$subWinHead = function (x) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$h2,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						A4(
						$rtfeldman$elm_css$Css$margin4,
						$rtfeldman$elm_css$Css$px(0),
						$rtfeldman$elm_css$Css$px(0),
						$rtfeldman$elm_css$Css$px(10),
						$rtfeldman$elm_css$Css$px(0)),
						$rtfeldman$elm_css$Css$padding(
						$rtfeldman$elm_css$Css$px(3)),
						$rtfeldman$elm_css$Css$backgroundColor(
						A3($rtfeldman$elm_css$Css$rgb, 180, 180, 180)),
						$rtfeldman$elm_css$Css$fontFamily($rtfeldman$elm_css$Css$monospace),
						$rtfeldman$elm_css$Css$fontWeight($rtfeldman$elm_css$Css$normal),
						$rtfeldman$elm_css$Css$fontSize(
						$rtfeldman$elm_css$Css$px(14))
					]))
			]),
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$text(x)
			]));
};
var $author$project$MicroAgda$Viz$CodeViz$toolBoxWin = F2(
	function (title, bdy) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							A3(
							$rtfeldman$elm_css$Css$border3,
							$rtfeldman$elm_css$Css$px(2),
							$rtfeldman$elm_css$Css$solid,
							A3($rtfeldman$elm_css$Css$rgb, 200, 200, 200)),
							$rtfeldman$elm_css$Css$padding(
							$rtfeldman$elm_css$Css$px(0))
						]))
				]),
			_List_fromArray(
				[
					$author$project$MicroAgda$Viz$CodeViz$subWinHead(title),
					bdy
				]));
	});
var $author$project$MicroAgda$Viz$CodeViz$codeVizHtml = F4(
	function (mba, dc, n, cn2) {
		return A2(
			$elm$core$Result$map,
			function (x) {
				return A2(
					$author$project$MicroAgda$Viz$CodeViz$toolBoxWin,
					'normal form',
					A2(
						$rtfeldman$elm_css$Html$Styled$div,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Html$Styled$Attributes$css(
								_List_fromArray(
									[
										$rtfeldman$elm_css$Css$fontFamily($rtfeldman$elm_css$Css$monospace),
										$rtfeldman$elm_css$Css$padding(
										$rtfeldman$elm_css$Css$px(4))
									]))
							]),
						_List_fromArray(
							[x])));
			},
			A2(
				$elm$core$Result$map,
				A2($author$project$MicroAgda$Viz$CodeViz$collectCubHtml, mba, _List_Nil),
				A2(
					$author$project$MicroAgda$Viz$Structures$stepMap,
					$author$project$MicroAgda$Viz$CodeViz$genHtml(mba),
					$elm$core$Result$Ok(
						_Utils_Tuple3(dc, n, cn2)))));
	});
var $rtfeldman$elm_css$Css$center = $rtfeldman$elm_css$Css$prop1('center');
var $rtfeldman$elm_css$Css$textAlign = function (fn) {
	return A3(
		$rtfeldman$elm_css$Css$Internal$getOverloadedProperty,
		'textAlign',
		'text-align',
		fn($rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
};
var $author$project$MicroAgda$Viz$Gui$ctxCellStyle = $rtfeldman$elm_css$Html$Styled$Attributes$css(
	_List_fromArray(
		[
			$rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$inlineBlock),
			$rtfeldman$elm_css$Css$margin(
			$rtfeldman$elm_css$Css$px(8)),
			$rtfeldman$elm_css$Css$textAlign($rtfeldman$elm_css$Css$center),
			$rtfeldman$elm_css$Css$padding(
			$rtfeldman$elm_css$Css$px(5))
		]));
var $author$project$MicroAgda$Viz$Gui$ctxCellsRowStyle = $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_Nil);
var $author$project$MicroAgda$Viz$Gui$ctxIconSize = 128;
var $avh4$elm_color$Color$white = A4($avh4$elm_color$Color$RgbaSpace, 255 / 255, 255 / 255, 255 / 255, 1.0);
var $author$project$Gui$Draw$defaultDrawingHTMLSettings = {
	bgColor: $elm$core$Maybe$Just($avh4$elm_color$Color$white),
	height: 1024,
	width: 1024
};
var $author$project$Gui$Draw$defCanvSet = $author$project$Gui$Draw$defaultDrawingHTMLSettings;
var $author$project$MicroAgda$Viz$Gui$ctxIconS = _Utils_update(
	$author$project$Gui$Draw$defCanvSet,
	{height: $author$project$MicroAgda$Viz$Gui$ctxIconSize, width: $author$project$MicroAgda$Viz$Gui$ctxIconSize});
var $author$project$MicroAgda$Viz$Structures$extendInth = F2(
	function (k, dc) {
		var ss = A2(
			$elm$core$Set$union,
			$author$project$MicroAgda$Internal$Term$buildInNamesSet,
			$author$project$MicroAgda$Internal$Ctx$symbolsSet(
				$author$project$MicroAgda$Viz$Structures$toCtx(dc)));
		var names = A2(
			$author$project$MicroAgda$StringTools$makeFreshList,
			A3(
				$author$project$ResultExtra$padRight,
				k,
				'i',
				A2($elm$core$String$split, '', 'ijkl')),
			ss);
		return A2(
			$author$project$ResultExtra$pairR,
			names,
			A3(
				$elm$core$List$foldl,
				$author$project$ResultExtra$swap($author$project$MicroAgda$Viz$Structures$extendI),
				dc,
				names));
	});
var $author$project$MicroAgda$Viz$Structures$lookDCtxIns = F2(
	function (dc, i) {
		return A2(
			$elm$core$Result$andThen,
			$elm$core$Result$fromMaybe('defined but not cubical'),
			A2(
				$elm$core$Result$andThen,
				function (_v0) {
					var name = _v0.a;
					var ct = _v0.b;
					var x = _v0.c;
					return A2(
						$elm$core$Result$fromMaybe,
						'inside not defined',
						A2(
							$elm$core$Maybe$map,
							$elm$core$Maybe$map(
								function (y) {
									return _Utils_Tuple3(name, ct, y);
								}),
							A2($elm$core$Maybe$map, $author$project$MicroAgda$Viz$Structures$toInside, x)));
				},
				A2(
					$elm$core$Result$fromMaybe,
					'not in context',
					A2(
						$author$project$ResultExtra$lookByIntInList,
						$elm$core$List$reverse(dc.list),
						i))));
	});
var $author$project$MicroAgda$Viz$Structures$makeGenericTerm = F2(
	function (dc, i) {
		return A2(
			$author$project$MicroAgda$Viz$Structures$describeErr,
			'makeGenericTerm : ',
			A2(
				$elm$core$Result$andThen,
				function (_v0) {
					var nameTy = _v0.a;
					var ct = _v0.b;
					var _v1 = _v0.c;
					var n = _v1.a;
					var _v2 = A2(
						$author$project$MicroAgda$Viz$Structures$extendInth,
						n,
						A2($author$project$MicroAgda$Viz$Structures$truncateCtx, i + 1, dc));
					var dcc = _v2.a;
					var nms = _v2.b;
					return A2(
						$elm$core$Result$map,
						$author$project$ResultExtra$pairR(dcc),
						A2(
							$elm$core$Result$andThen,
							function (na) {
								return (!_Utils_eq(na, n)) ? $elm$core$Result$Err('generated data not consistent with type arity') : ((!n) ? $elm$core$Result$Ok(
									$author$project$MicroAgda$Internal$Term$ctxVar(i)) : A2(
									$elm$core$Result$andThen,
									function (bct) {
										var rtm = A3(
											$elm$core$List$foldl,
											function (name) {
												return function (rawTerm) {
													return A2(
														$author$project$MicroAgda$Raw$App,
														rawTerm,
														$author$project$MicroAgda$Raw$Var(name));
												};
											},
											$author$project$MicroAgda$Raw$Var(nameTy),
											nms);
										return A2(
											$author$project$MicroAgda$Viz$Structures$describeErr,
											'tc er : ',
											A3(
												$author$project$MicroAgda$TypeChecker$tC,
												$author$project$MicroAgda$Viz$Structures$toCtx(dcc),
												bct,
												rtm));
									},
									$author$project$MicroAgda$TypeChecker$getBaseType(ct)));
							},
							A2(
								$elm$core$Result$fromMaybe,
								'arity not detteceted',
								$author$project$MicroAgda$Internal$Ctx$arity(ct))));
				},
				A2($author$project$MicroAgda$Viz$Structures$lookDCtxIns, dc, i)));
	});
var $author$project$MicroAgda$Viz$Process$drawGenericTerm = F2(
	function (dcAll, i) {
		return A2(
			$elm$core$Result$map,
			function (_v0) {
				var n = _v0.b;
				var _v1 = _v0.c;
				var dw = _v1.b;
				return _Utils_Tuple2(n, dw);
			},
			A2(
				$elm$core$Result$andThen,
				$author$project$MicroAgda$Viz$Process$drawTerm,
				A2($author$project$MicroAgda$Viz$Structures$makeGenericTerm, dcAll, i)));
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (_v0.$ === 'Just') {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $author$project$ResultExtra$gatherByInt = function (f) {
	return A2(
		$elm$core$Basics$composeR,
		A2(
			$elm$core$List$foldl,
			function (a) {
				var i = f(a);
				return A2(
					$elm$core$Dict$update,
					i,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Maybe$map(
							function (l) {
								return _Utils_ap(
									l,
									_List_fromArray(
										[a]));
							}),
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Maybe$withDefault(
								_List_fromArray(
									[a])),
							$elm$core$Maybe$Just)));
			},
			$elm$core$Dict$empty),
		$elm$core$Dict$toList);
};
var $joakin$elm_canvas$Canvas$Internal$Canvas$DrawableClear = F3(
	function (a, b, c) {
		return {$: 'DrawableClear', a: a, b: b, c: c};
	});
var $joakin$elm_canvas$Canvas$Internal$Canvas$NotSpecified = {$: 'NotSpecified'};
var $joakin$elm_canvas$Canvas$Renderable = function (a) {
	return {$: 'Renderable', a: a};
};
var $joakin$elm_canvas$Canvas$clear = F3(
	function (point, w, h) {
		return $joakin$elm_canvas$Canvas$Renderable(
			{
				commands: _List_Nil,
				drawOp: $joakin$elm_canvas$Canvas$Internal$Canvas$NotSpecified,
				drawable: A3($joakin$elm_canvas$Canvas$Internal$Canvas$DrawableClear, point, w, h)
			});
	});
var $joakin$elm_canvas$Canvas$Internal$Canvas$Fill = function (a) {
	return {$: 'Fill', a: a};
};
var $joakin$elm_canvas$Canvas$Internal$Canvas$SettingDrawOp = function (a) {
	return {$: 'SettingDrawOp', a: a};
};
var $joakin$elm_canvas$Canvas$Settings$fill = function (color) {
	return $joakin$elm_canvas$Canvas$Internal$Canvas$SettingDrawOp(
		$joakin$elm_canvas$Canvas$Internal$Canvas$Fill(color));
};
var $author$project$MicroAgda$Drawing$pxScale = function (_v0) {
	var w = _v0.a;
	var h = _v0.b;
	return $elm$core$List$map(
		$elm$core$Tuple$mapFirst(
			$elm$core$Tuple$mapSecond(
				$elm$core$List$map(
					function (l) {
						if ((l.b && l.b.b) && (!l.b.b.b)) {
							var x = l.a;
							var _v2 = l.b;
							var y = _v2.a;
							return _List_fromArray(
								[x * w, y * h]);
						} else {
							return l;
						}
					}))));
};
var $joakin$elm_canvas$Canvas$Internal$Canvas$Rect = F3(
	function (a, b, c) {
		return {$: 'Rect', a: a, b: b, c: c};
	});
var $joakin$elm_canvas$Canvas$rect = F3(
	function (pos, width, height) {
		return A3($joakin$elm_canvas$Canvas$Internal$Canvas$Rect, pos, width, height);
	});
var $joakin$elm_canvas$Canvas$Internal$Canvas$DrawableShapes = function (a) {
	return {$: 'DrawableShapes', a: a};
};
var $joakin$elm_canvas$Canvas$Internal$Canvas$FillAndStroke = F2(
	function (a, b) {
		return {$: 'FillAndStroke', a: a, b: b};
	});
var $joakin$elm_canvas$Canvas$Internal$Canvas$Stroke = function (a) {
	return {$: 'Stroke', a: a};
};
var $joakin$elm_canvas$Canvas$mergeDrawOp = F2(
	function (op1, op2) {
		var _v0 = _Utils_Tuple2(op1, op2);
		_v0$7:
		while (true) {
			switch (_v0.b.$) {
				case 'FillAndStroke':
					var _v1 = _v0.b;
					var c = _v1.a;
					var sc = _v1.b;
					return A2($joakin$elm_canvas$Canvas$Internal$Canvas$FillAndStroke, c, sc);
				case 'Fill':
					switch (_v0.a.$) {
						case 'Fill':
							var c = _v0.b.a;
							return $joakin$elm_canvas$Canvas$Internal$Canvas$Fill(c);
						case 'Stroke':
							var c1 = _v0.a.a;
							var c2 = _v0.b.a;
							return A2($joakin$elm_canvas$Canvas$Internal$Canvas$FillAndStroke, c2, c1);
						case 'FillAndStroke':
							var _v2 = _v0.a;
							var c = _v2.a;
							var sc = _v2.b;
							var c2 = _v0.b.a;
							return A2($joakin$elm_canvas$Canvas$Internal$Canvas$FillAndStroke, c2, sc);
						default:
							break _v0$7;
					}
				case 'Stroke':
					switch (_v0.a.$) {
						case 'Stroke':
							var c = _v0.b.a;
							return $joakin$elm_canvas$Canvas$Internal$Canvas$Stroke(c);
						case 'Fill':
							var c1 = _v0.a.a;
							var c2 = _v0.b.a;
							return A2($joakin$elm_canvas$Canvas$Internal$Canvas$FillAndStroke, c1, c2);
						case 'FillAndStroke':
							var _v3 = _v0.a;
							var c = _v3.a;
							var sc = _v3.b;
							var sc2 = _v0.b.a;
							return A2($joakin$elm_canvas$Canvas$Internal$Canvas$FillAndStroke, c, sc2);
						default:
							break _v0$7;
					}
				default:
					if (_v0.a.$ === 'NotSpecified') {
						break _v0$7;
					} else {
						var whatever = _v0.a;
						var _v5 = _v0.b;
						return whatever;
					}
			}
		}
		var _v4 = _v0.a;
		var whatever = _v0.b;
		return whatever;
	});
var $joakin$elm_canvas$Canvas$addSettingsToRenderable = F2(
	function (settings, renderable) {
		var addSetting = F2(
			function (setting, _v1) {
				var r = _v1.a;
				return $joakin$elm_canvas$Canvas$Renderable(
					function () {
						switch (setting.$) {
							case 'SettingCommand':
								var cmd = setting.a;
								return _Utils_update(
									r,
									{
										commands: A2($elm$core$List$cons, cmd, r.commands)
									});
							case 'SettingCommands':
								var cmds = setting.a;
								return _Utils_update(
									r,
									{
										commands: A3($elm$core$List$foldl, $elm$core$List$cons, r.commands, cmds)
									});
							case 'SettingUpdateDrawable':
								var f = setting.a;
								return _Utils_update(
									r,
									{
										drawable: f(r.drawable)
									});
							default:
								var op = setting.a;
								return _Utils_update(
									r,
									{
										drawOp: A2($joakin$elm_canvas$Canvas$mergeDrawOp, r.drawOp, op)
									});
						}
					}());
			});
		return A3($elm$core$List$foldl, addSetting, renderable, settings);
	});
var $joakin$elm_canvas$Canvas$shapes = F2(
	function (settings, ss) {
		return A2(
			$joakin$elm_canvas$Canvas$addSettingsToRenderable,
			settings,
			$joakin$elm_canvas$Canvas$Renderable(
				{
					commands: _List_Nil,
					drawOp: $joakin$elm_canvas$Canvas$Internal$Canvas$NotSpecified,
					drawable: $joakin$elm_canvas$Canvas$Internal$Canvas$DrawableShapes(ss)
				}));
	});
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$html$Html$canvas = _VirtualDom_node('canvas');
var $joakin$elm_canvas$Canvas$cnvs = A2($elm$html$Html$canvas, _List_Nil, _List_Nil);
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $elm$html$Html$Attributes$property = $elm$virtual_dom$VirtualDom$property;
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$commands = function (list) {
	return A2(
		$elm$html$Html$Attributes$property,
		'cmds',
		A2($elm$json$Json$Encode$list, $elm$core$Basics$identity, list));
};
var $elm$html$Html$Attributes$height = function (n) {
	return A2(
		_VirtualDom_attribute,
		'height',
		$elm$core$String$fromInt(n));
};
var $elm$html$Html$Keyed$node = $elm$virtual_dom$VirtualDom$keyedNode;
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$empty = _List_Nil;
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn = F2(
	function (name, args) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'type',
					$elm$json$Json$Encode$string('function')),
					_Utils_Tuple2(
					'name',
					$elm$json$Json$Encode$string(name)),
					_Utils_Tuple2(
					'args',
					A2($elm$json$Json$Encode$list, $elm$core$Basics$identity, args))
				]));
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$beginPath = A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn, 'beginPath', _List_Nil);
var $elm$json$Json$Encode$float = _Json_wrap;
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$clearRect = F4(
	function (x, y, width, height) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'clearRect',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(x),
					$elm$json$Json$Encode$float(y),
					$elm$json$Json$Encode$float(width),
					$elm$json$Json$Encode$float(height)
				]));
	});
var $joakin$elm_canvas$Canvas$renderClear = F4(
	function (_v0, w, h, cmds) {
		var x = _v0.a;
		var y = _v0.b;
		return A2(
			$elm$core$List$cons,
			A4($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$clearRect, x, y, w, h),
			cmds);
	});
var $elm$json$Json$Encode$bool = _Json_wrap;
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$arc = F6(
	function (x, y, radius, startAngle, endAngle, anticlockwise) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'arc',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(x),
					$elm$json$Json$Encode$float(y),
					$elm$json$Json$Encode$float(radius),
					$elm$json$Json$Encode$float(startAngle),
					$elm$json$Json$Encode$float(endAngle),
					$elm$json$Json$Encode$bool(anticlockwise)
				]));
	});
var $elm$core$Basics$pi = _Basics_pi;
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$circle = F3(
	function (x, y, r) {
		return A6($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$arc, x, y, r, 0, 2 * $elm$core$Basics$pi, false);
	});
var $elm$core$Basics$cos = _Basics_cos;
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$moveTo = F2(
	function (x, y) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'moveTo',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(x),
					$elm$json$Json$Encode$float(y)
				]));
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$rect = F4(
	function (x, y, w, h) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'rect',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(x),
					$elm$json$Json$Encode$float(y),
					$elm$json$Json$Encode$float(w),
					$elm$json$Json$Encode$float(h)
				]));
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$arcTo = F5(
	function (x1, y1, x2, y2, radius) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'arcTo',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(x1),
					$elm$json$Json$Encode$float(y1),
					$elm$json$Json$Encode$float(x2),
					$elm$json$Json$Encode$float(y2),
					$elm$json$Json$Encode$float(radius)
				]));
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$bezierCurveTo = F6(
	function (cp1x, cp1y, cp2x, cp2y, x, y) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'bezierCurveTo',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(cp1x),
					$elm$json$Json$Encode$float(cp1y),
					$elm$json$Json$Encode$float(cp2x),
					$elm$json$Json$Encode$float(cp2y),
					$elm$json$Json$Encode$float(x),
					$elm$json$Json$Encode$float(y)
				]));
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$lineTo = F2(
	function (x, y) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'lineTo',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(x),
					$elm$json$Json$Encode$float(y)
				]));
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$quadraticCurveTo = F4(
	function (cpx, cpy, x, y) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'quadraticCurveTo',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(cpx),
					$elm$json$Json$Encode$float(cpy),
					$elm$json$Json$Encode$float(x),
					$elm$json$Json$Encode$float(y)
				]));
	});
var $joakin$elm_canvas$Canvas$renderLineSegment = F2(
	function (segment, cmds) {
		switch (segment.$) {
			case 'ArcTo':
				var _v1 = segment.a;
				var x = _v1.a;
				var y = _v1.b;
				var _v2 = segment.b;
				var x2 = _v2.a;
				var y2 = _v2.b;
				var radius = segment.c;
				return A2(
					$elm$core$List$cons,
					A5($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$arcTo, x, y, x2, y2, radius),
					cmds);
			case 'BezierCurveTo':
				var _v3 = segment.a;
				var cp1x = _v3.a;
				var cp1y = _v3.b;
				var _v4 = segment.b;
				var cp2x = _v4.a;
				var cp2y = _v4.b;
				var _v5 = segment.c;
				var x = _v5.a;
				var y = _v5.b;
				return A2(
					$elm$core$List$cons,
					A6($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$bezierCurveTo, cp1x, cp1y, cp2x, cp2y, x, y),
					cmds);
			case 'LineTo':
				var _v6 = segment.a;
				var x = _v6.a;
				var y = _v6.b;
				return A2(
					$elm$core$List$cons,
					A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$lineTo, x, y),
					cmds);
			case 'MoveTo':
				var _v7 = segment.a;
				var x = _v7.a;
				var y = _v7.b;
				return A2(
					$elm$core$List$cons,
					A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$moveTo, x, y),
					cmds);
			default:
				var _v8 = segment.a;
				var cpx = _v8.a;
				var cpy = _v8.b;
				var _v9 = segment.b;
				var x = _v9.a;
				var y = _v9.b;
				return A2(
					$elm$core$List$cons,
					A4($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$quadraticCurveTo, cpx, cpy, x, y),
					cmds);
		}
	});
var $elm$core$Basics$sin = _Basics_sin;
var $joakin$elm_canvas$Canvas$renderShape = F2(
	function (shape, cmds) {
		switch (shape.$) {
			case 'Rect':
				var _v1 = shape.a;
				var x = _v1.a;
				var y = _v1.b;
				var w = shape.b;
				var h = shape.c;
				return A2(
					$elm$core$List$cons,
					A4($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$rect, x, y, w, h),
					A2(
						$elm$core$List$cons,
						A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$moveTo, x, y),
						cmds));
			case 'Circle':
				var _v2 = shape.a;
				var x = _v2.a;
				var y = _v2.b;
				var r = shape.b;
				return A2(
					$elm$core$List$cons,
					A3($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$circle, x, y, r),
					A2(
						$elm$core$List$cons,
						A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$moveTo, x + r, y),
						cmds));
			case 'Path':
				var _v3 = shape.a;
				var x = _v3.a;
				var y = _v3.b;
				var segments = shape.b;
				return A3(
					$elm$core$List$foldl,
					$joakin$elm_canvas$Canvas$renderLineSegment,
					A2(
						$elm$core$List$cons,
						A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$moveTo, x, y),
						cmds),
					segments);
			default:
				var _v4 = shape.a;
				var x = _v4.a;
				var y = _v4.b;
				var radius = shape.b;
				var startAngle = shape.c;
				var endAngle = shape.d;
				var anticlockwise = shape.e;
				return A2(
					$elm$core$List$cons,
					A2(
						$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$moveTo,
						x + (radius * $elm$core$Basics$cos(endAngle)),
						y + (radius * $elm$core$Basics$sin(endAngle))),
					A2(
						$elm$core$List$cons,
						A6($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$arc, x, y, radius, startAngle, endAngle, anticlockwise),
						A2(
							$elm$core$List$cons,
							A2(
								$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$moveTo,
								x + (radius * $elm$core$Basics$cos(startAngle)),
								y + (radius * $elm$core$Basics$sin(startAngle))),
							cmds)));
		}
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$NonZero = {$: 'NonZero'};
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fillRuleToString = function (fillRule) {
	if (fillRule.$ === 'NonZero') {
		return 'nonzero';
	} else {
		return 'evenodd';
	}
};
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fill = function (fillRule) {
	return A2(
		$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
		'fill',
		_List_fromArray(
			[
				$elm$json$Json$Encode$string(
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fillRuleToString(fillRule))
			]));
};
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$field = F2(
	function (name, value) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'type',
					$elm$json$Json$Encode$string('field')),
					_Utils_Tuple2(
					'name',
					$elm$json$Json$Encode$string(name)),
					_Utils_Tuple2('value', value)
				]));
	});
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $elm$core$Basics$round = _Basics_round;
var $avh4$elm_color$Color$toCssString = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	var roundTo = function (x) {
		return $elm$core$Basics$round(x * 1000) / 1000;
	};
	var pct = function (x) {
		return $elm$core$Basics$round(x * 10000) / 100;
	};
	return $elm$core$String$concat(
		_List_fromArray(
			[
				'rgba(',
				$elm$core$String$fromFloat(
				pct(r)),
				'%,',
				$elm$core$String$fromFloat(
				pct(g)),
				'%,',
				$elm$core$String$fromFloat(
				pct(b)),
				'%,',
				$elm$core$String$fromFloat(
				roundTo(a)),
				')'
			]));
};
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fillStyle = function (color) {
	return A2(
		$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$field,
		'fillStyle',
		$elm$json$Json$Encode$string(
			$avh4$elm_color$Color$toCssString(color)));
};
var $joakin$elm_canvas$Canvas$renderShapeFill = F2(
	function (c, cmds) {
		return A2(
			$elm$core$List$cons,
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fill($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$NonZero),
			A2(
				$elm$core$List$cons,
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fillStyle(c),
				cmds));
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$stroke = A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn, 'stroke', _List_Nil);
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$strokeStyle = function (color) {
	return A2(
		$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$field,
		'strokeStyle',
		$elm$json$Json$Encode$string(
			$avh4$elm_color$Color$toCssString(color)));
};
var $joakin$elm_canvas$Canvas$renderShapeStroke = F2(
	function (c, cmds) {
		return A2(
			$elm$core$List$cons,
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$stroke,
			A2(
				$elm$core$List$cons,
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$strokeStyle(c),
				cmds));
	});
var $joakin$elm_canvas$Canvas$renderShapeDrawOp = F2(
	function (drawOp, cmds) {
		switch (drawOp.$) {
			case 'NotSpecified':
				return A2($joakin$elm_canvas$Canvas$renderShapeFill, $avh4$elm_color$Color$black, cmds);
			case 'Fill':
				var c = drawOp.a;
				return A2($joakin$elm_canvas$Canvas$renderShapeFill, c, cmds);
			case 'Stroke':
				var c = drawOp.a;
				return A2($joakin$elm_canvas$Canvas$renderShapeStroke, c, cmds);
			default:
				var fc = drawOp.a;
				var sc = drawOp.b;
				return A2(
					$joakin$elm_canvas$Canvas$renderShapeStroke,
					sc,
					A2($joakin$elm_canvas$Canvas$renderShapeFill, fc, cmds));
		}
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fillText = F4(
	function (text, x, y, maybeMaxWidth) {
		if (maybeMaxWidth.$ === 'Nothing') {
			return A2(
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
				'fillText',
				_List_fromArray(
					[
						$elm$json$Json$Encode$string(text),
						$elm$json$Json$Encode$float(x),
						$elm$json$Json$Encode$float(y)
					]));
		} else {
			var maxWidth = maybeMaxWidth.a;
			return A2(
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
				'fillText',
				_List_fromArray(
					[
						$elm$json$Json$Encode$string(text),
						$elm$json$Json$Encode$float(x),
						$elm$json$Json$Encode$float(y),
						$elm$json$Json$Encode$float(maxWidth)
					]));
		}
	});
var $joakin$elm_canvas$Canvas$renderTextFill = F5(
	function (txt, x, y, color, cmds) {
		return A2(
			$elm$core$List$cons,
			A4($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fillText, txt.text, x, y, txt.maxWidth),
			A2(
				$elm$core$List$cons,
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fillStyle(color),
				cmds));
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$strokeText = F4(
	function (text, x, y, maybeMaxWidth) {
		if (maybeMaxWidth.$ === 'Nothing') {
			return A2(
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
				'strokeText',
				_List_fromArray(
					[
						$elm$json$Json$Encode$string(text),
						$elm$json$Json$Encode$float(x),
						$elm$json$Json$Encode$float(y)
					]));
		} else {
			var maxWidth = maybeMaxWidth.a;
			return A2(
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
				'strokeText',
				_List_fromArray(
					[
						$elm$json$Json$Encode$string(text),
						$elm$json$Json$Encode$float(x),
						$elm$json$Json$Encode$float(y),
						$elm$json$Json$Encode$float(maxWidth)
					]));
		}
	});
var $joakin$elm_canvas$Canvas$renderTextStroke = F5(
	function (txt, x, y, color, cmds) {
		return A2(
			$elm$core$List$cons,
			A4($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$strokeText, txt.text, x, y, txt.maxWidth),
			A2(
				$elm$core$List$cons,
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$strokeStyle(color),
				cmds));
	});
var $joakin$elm_canvas$Canvas$renderTextDrawOp = F3(
	function (drawOp, txt, cmds) {
		var _v0 = txt.point;
		var x = _v0.a;
		var y = _v0.b;
		switch (drawOp.$) {
			case 'NotSpecified':
				return A5($joakin$elm_canvas$Canvas$renderTextFill, txt, x, y, $avh4$elm_color$Color$black, cmds);
			case 'Fill':
				var c = drawOp.a;
				return A5($joakin$elm_canvas$Canvas$renderTextFill, txt, x, y, c, cmds);
			case 'Stroke':
				var c = drawOp.a;
				return A5($joakin$elm_canvas$Canvas$renderTextStroke, txt, x, y, c, cmds);
			default:
				var fc = drawOp.a;
				var sc = drawOp.b;
				return A5(
					$joakin$elm_canvas$Canvas$renderTextStroke,
					txt,
					x,
					y,
					sc,
					A5($joakin$elm_canvas$Canvas$renderTextFill, txt, x, y, fc, cmds));
		}
	});
var $joakin$elm_canvas$Canvas$renderText = F3(
	function (drawOp, txt, cmds) {
		return A3($joakin$elm_canvas$Canvas$renderTextDrawOp, drawOp, txt, cmds);
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$drawImage = F9(
	function (sx, sy, sw, sh, dx, dy, dw, dh, imageObj) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'drawImage',
			_List_fromArray(
				[
					imageObj,
					$elm$json$Json$Encode$float(sx),
					$elm$json$Json$Encode$float(sy),
					$elm$json$Json$Encode$float(sw),
					$elm$json$Json$Encode$float(sh),
					$elm$json$Json$Encode$float(dx),
					$elm$json$Json$Encode$float(dy),
					$elm$json$Json$Encode$float(dw),
					$elm$json$Json$Encode$float(dh)
				]));
	});
var $joakin$elm_canvas$Canvas$Internal$Texture$drawTexture = F4(
	function (x, y, t, cmds) {
		return A2(
			$elm$core$List$cons,
			function () {
				if (t.$ === 'TImage') {
					var image = t.a;
					return A9($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$drawImage, 0, 0, image.width, image.height, x, y, image.width, image.height, image.json);
				} else {
					var sprite = t.a;
					var image = t.b;
					return A9($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$drawImage, sprite.x, sprite.y, sprite.width, sprite.height, x, y, sprite.width, sprite.height, image.json);
				}
			}(),
			cmds);
	});
var $joakin$elm_canvas$Canvas$renderTexture = F3(
	function (_v0, t, cmds) {
		var x = _v0.a;
		var y = _v0.b;
		return A4($joakin$elm_canvas$Canvas$Internal$Texture$drawTexture, x, y, t, cmds);
	});
var $joakin$elm_canvas$Canvas$renderDrawable = F3(
	function (drawable, drawOp, cmds) {
		switch (drawable.$) {
			case 'DrawableText':
				var txt = drawable.a;
				return A3($joakin$elm_canvas$Canvas$renderText, drawOp, txt, cmds);
			case 'DrawableShapes':
				var ss = drawable.a;
				return A2(
					$joakin$elm_canvas$Canvas$renderShapeDrawOp,
					drawOp,
					A3(
						$elm$core$List$foldl,
						$joakin$elm_canvas$Canvas$renderShape,
						A2($elm$core$List$cons, $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$beginPath, cmds),
						ss));
			case 'DrawableTexture':
				var p = drawable.a;
				var t = drawable.b;
				return A3($joakin$elm_canvas$Canvas$renderTexture, p, t, cmds);
			default:
				var p = drawable.a;
				var w = drawable.b;
				var h = drawable.c;
				return A4($joakin$elm_canvas$Canvas$renderClear, p, w, h, cmds);
		}
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$restore = A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn, 'restore', _List_Nil);
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$save = A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn, 'save', _List_Nil);
var $joakin$elm_canvas$Canvas$renderOne = F2(
	function (_v0, cmds) {
		var data = _v0.a;
		var commands = data.commands;
		var drawable = data.drawable;
		var drawOp = data.drawOp;
		return A2(
			$elm$core$List$cons,
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$restore,
			A3(
				$joakin$elm_canvas$Canvas$renderDrawable,
				drawable,
				drawOp,
				_Utils_ap(
					commands,
					A2($elm$core$List$cons, $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$save, cmds))));
	});
var $joakin$elm_canvas$Canvas$render = function (entities) {
	return A3($elm$core$List$foldl, $joakin$elm_canvas$Canvas$renderOne, $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$empty, entities);
};
var $joakin$elm_canvas$Canvas$Internal$Texture$TImage = function (a) {
	return {$: 'TImage', a: a};
};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $joakin$elm_canvas$Canvas$decodeTextureImageInfo = A2(
	$elm$json$Json$Decode$andThen,
	function (target) {
		return A3(
			$elm$json$Json$Decode$map2,
			F2(
				function (width, height) {
					return {height: height, json: target, width: width};
				}),
			A2(
				$elm$json$Json$Decode$at,
				_List_fromArray(
					['target', 'width']),
				$elm$json$Json$Decode$float),
			A2(
				$elm$json$Json$Decode$at,
				_List_fromArray(
					['target', 'height']),
				$elm$json$Json$Decode$float));
	},
	A2($elm$json$Json$Decode$field, 'target', $elm$json$Json$Decode$value));
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $joakin$elm_canvas$Canvas$renderTextureSource = function (textureSource) {
	var url = textureSource.a;
	var onLoad = textureSource.b;
	return _Utils_Tuple2(
		url,
		A2(
			$elm$html$Html$img,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$src(url),
					A2($elm$html$Html$Attributes$attribute, 'crossorigin', 'anonymous'),
					A2($elm$html$Html$Attributes$style, 'display', 'none'),
					A2(
					$elm$html$Html$Events$on,
					'load',
					A2(
						$elm$json$Json$Decode$map,
						A2(
							$elm$core$Basics$composeR,
							$joakin$elm_canvas$Canvas$Internal$Texture$TImage,
							A2($elm$core$Basics$composeR, $elm$core$Maybe$Just, onLoad)),
						$joakin$elm_canvas$Canvas$decodeTextureImageInfo)),
					A2(
					$elm$html$Html$Events$on,
					'error',
					$elm$json$Json$Decode$succeed(
						onLoad($elm$core$Maybe$Nothing)))
				]),
			_List_Nil));
};
var $elm$html$Html$Attributes$width = function (n) {
	return A2(
		_VirtualDom_attribute,
		'width',
		$elm$core$String$fromInt(n));
};
var $joakin$elm_canvas$Canvas$toHtmlWith = F3(
	function (options, attrs, entities) {
		return A3(
			$elm$html$Html$Keyed$node,
			'elm-canvas',
			A2(
				$elm$core$List$cons,
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$commands(
					$joakin$elm_canvas$Canvas$render(entities)),
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$height(options.height),
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$width(options.width),
						attrs))),
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2('__canvas', $joakin$elm_canvas$Canvas$cnvs),
				A2($elm$core$List$map, $joakin$elm_canvas$Canvas$renderTextureSource, options.textures)));
	});
var $joakin$elm_canvas$Canvas$toHtml = F3(
	function (_v0, attrs, entities) {
		var w = _v0.a;
		var h = _v0.b;
		return A3(
			$joakin$elm_canvas$Canvas$toHtmlWith,
			{height: h, textures: _List_Nil, width: w},
			attrs,
			entities);
	});
var $author$project$ResultExtra$isEqual = F2(
	function (x, y) {
		var _v0 = A2($elm$core$Basics$compare, x, y);
		if (_v0.$ === 'EQ') {
			return true;
		} else {
			return false;
		}
	});
var $joakin$elm_canvas$Canvas$Settings$Advanced$DestinationOut = {$: 'DestinationOut'};
var $joakin$elm_canvas$Canvas$Settings$Advanced$DestinationOver = {$: 'DestinationOver'};
var $joakin$elm_canvas$Canvas$Settings$Advanced$SourceOver = {$: 'SourceOver'};
var $joakin$elm_canvas$Canvas$Internal$Canvas$Circle = F2(
	function (a, b) {
		return {$: 'Circle', a: a, b: b};
	});
var $joakin$elm_canvas$Canvas$circle = F2(
	function (pos, radius) {
		return A2($joakin$elm_canvas$Canvas$Internal$Canvas$Circle, pos, radius);
	});
var $joakin$elm_canvas$Canvas$Internal$Canvas$SettingCommand = function (a) {
	return {$: 'SettingCommand', a: a};
};
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$globalCompositeOperation = function (mode) {
	return A2(
		$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$field,
		'globalCompositeOperation',
		$elm$json$Json$Encode$string(mode));
};
var $joakin$elm_canvas$Canvas$Settings$Advanced$globalCompositeOperationModeToString = function (mode) {
	switch (mode.$) {
		case 'SourceOver':
			return 'source-over';
		case 'SourceIn':
			return 'source-in';
		case 'SourceOut':
			return 'source-out';
		case 'SourceAtop':
			return 'source-atop';
		case 'DestinationOver':
			return 'destination-over';
		case 'DestinationIn':
			return 'destination-in';
		case 'DestinationOut':
			return 'destination-out';
		case 'DestinationAtop':
			return 'destination-atop';
		case 'Lighter':
			return 'lighter';
		case 'Copy':
			return 'copy';
		case 'Xor':
			return 'xor';
		case 'Multiply':
			return 'multiply';
		case 'Screen':
			return 'screen';
		case 'Overlay':
			return 'overlay';
		case 'Darken':
			return 'darken';
		case 'Lighten':
			return 'lighten';
		case 'ColorDodge':
			return 'color-dodge';
		case 'ColorBurn':
			return 'color-burn';
		case 'HardLight':
			return 'hard-light';
		case 'SoftLight':
			return 'soft-light';
		case 'Difference':
			return 'difference';
		case 'Exclusion':
			return 'exclusion';
		case 'Hue':
			return 'hue';
		case 'Saturation':
			return 'saturation';
		case 'Color':
			return 'color';
		default:
			return 'luminosity';
	}
};
var $joakin$elm_canvas$Canvas$Settings$Advanced$compositeOperationMode = function (mode) {
	return $joakin$elm_canvas$Canvas$Internal$Canvas$SettingCommand(
		$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$globalCompositeOperation(
			$joakin$elm_canvas$Canvas$Settings$Advanced$globalCompositeOperationModeToString(mode)));
};
var $joakin$elm_canvas$Canvas$Internal$Canvas$LineTo = function (a) {
	return {$: 'LineTo', a: a};
};
var $joakin$elm_canvas$Canvas$lineTo = function (point) {
	return $joakin$elm_canvas$Canvas$Internal$Canvas$LineTo(point);
};
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$lineWidth = function (value) {
	return A2(
		$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$field,
		'lineWidth',
		$elm$json$Json$Encode$float(value));
};
var $joakin$elm_canvas$Canvas$Settings$Line$lineWidth = function (width) {
	return $joakin$elm_canvas$Canvas$Internal$Canvas$SettingCommand(
		$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$lineWidth(width));
};
var $joakin$elm_canvas$Canvas$Internal$Canvas$Path = F2(
	function (a, b) {
		return {$: 'Path', a: a, b: b};
	});
var $joakin$elm_canvas$Canvas$path = F2(
	function (startingPoint, segments) {
		return A2($joakin$elm_canvas$Canvas$Internal$Canvas$Path, startingPoint, segments);
	});
var $author$project$MicroAgda$Drawing$pointR = 1;
var $joakin$elm_canvas$Canvas$Settings$stroke = function (color) {
	return $joakin$elm_canvas$Canvas$Internal$Canvas$SettingDrawOp(
		$joakin$elm_canvas$Canvas$Internal$Canvas$Stroke(color));
};
var $author$project$MicroAgda$Drawing$toRenderable = function (_v0) {
	var _v1 = _v0.a;
	var n = _v1.a;
	var l = _v1.b;
	var a = _v0.b;
	return A2(
		$elm$core$Maybe$map,
		$elm$core$Tuple$mapFirst(
			A2(
				$elm$core$Basics$composeR,
				$elm$core$List$singleton,
				function () {
					var op = A3($author$project$ResultExtra$choose, n === 1, $joakin$elm_canvas$Canvas$Settings$fill, $joakin$elm_canvas$Canvas$Settings$stroke);
					return $joakin$elm_canvas$Canvas$shapes(
						A2(
							$elm$core$List$append,
							_List_fromArray(
								[
									$joakin$elm_canvas$Canvas$Settings$Line$lineWidth(1)
								]),
							A2(
								$elm$core$Maybe$withDefault,
								_List_fromArray(
									[
										$joakin$elm_canvas$Canvas$Settings$Advanced$compositeOperationMode($joakin$elm_canvas$Canvas$Settings$Advanced$DestinationOut),
										op($avh4$elm_color$Color$black)
									]),
								A2(
									$elm$core$Maybe$map,
									function (_v21) {
										var b = _v21.a;
										var c = _v21.b;
										return A2(
											$elm$core$List$append,
											_List_fromArray(
												[
													$joakin$elm_canvas$Canvas$Settings$Advanced$compositeOperationMode(
													A3($author$project$ResultExtra$choose, b, $joakin$elm_canvas$Canvas$Settings$Advanced$SourceOver, $joakin$elm_canvas$Canvas$Settings$Advanced$DestinationOver)),
													op(c.a)
												]),
											c.b);
									},
									a))));
				}())),
		function () {
			_v2$3:
			while (true) {
				if (((l.b && l.a.b) && l.a.b.b) && (!l.a.b.b.b)) {
					if (!l.b.b) {
						var _v3 = l.a;
						var x = _v3.a;
						var _v4 = _v3.b;
						var y = _v4.a;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(
								A2(
									$joakin$elm_canvas$Canvas$circle,
									_Utils_Tuple2(x, y),
									$author$project$MicroAgda$Drawing$pointR),
								0));
					} else {
						if ((l.b.a.b && l.b.a.b.b) && (!l.b.a.b.b.b)) {
							if (!l.b.b.b) {
								var _v5 = l.a;
								var x0 = _v5.a;
								var _v6 = _v5.b;
								var y0 = _v6.a;
								var _v7 = l.b;
								var _v8 = _v7.a;
								var x1 = _v8.a;
								var _v9 = _v8.b;
								var y1 = _v9.a;
								return $elm$core$Maybe$Just(
									_Utils_Tuple2(
										A2(
											$joakin$elm_canvas$Canvas$path,
											_Utils_Tuple2(x0, y0),
											_List_fromArray(
												[
													$joakin$elm_canvas$Canvas$lineTo(
													_Utils_Tuple2(x1, y1))
												])),
										1));
							} else {
								if (((((((l.b.b.a.b && l.b.b.a.b.b) && (!l.b.b.a.b.b.b)) && l.b.b.b.b) && l.b.b.b.a.b) && l.b.b.b.a.b.b) && (!l.b.b.b.a.b.b.b)) && (!l.b.b.b.b.b)) {
									var _v10 = l.a;
									var x0 = _v10.a;
									var _v11 = _v10.b;
									var y0 = _v11.a;
									var _v12 = l.b;
									var _v13 = _v12.a;
									var x1 = _v13.a;
									var _v14 = _v13.b;
									var y1 = _v14.a;
									var _v15 = _v12.b;
									var _v16 = _v15.a;
									var x2 = _v16.a;
									var _v17 = _v16.b;
									var y2 = _v17.a;
									var _v18 = _v15.b;
									var _v19 = _v18.a;
									var x3 = _v19.a;
									var _v20 = _v19.b;
									var y3 = _v20.a;
									return $elm$core$Maybe$Just(
										_Utils_Tuple2(
											A2(
												$joakin$elm_canvas$Canvas$path,
												_Utils_Tuple2(x0, y0),
												_List_fromArray(
													[
														$joakin$elm_canvas$Canvas$lineTo(
														_Utils_Tuple2(x1, y1)),
														$joakin$elm_canvas$Canvas$lineTo(
														_Utils_Tuple2(x3, y3)),
														$joakin$elm_canvas$Canvas$lineTo(
														_Utils_Tuple2(x2, y2))
													])),
											2));
								} else {
									break _v2$3;
								}
							}
						} else {
							break _v2$3;
						}
					}
				} else {
					break _v2$3;
				}
			}
			return $elm$core$Maybe$Nothing;
		}());
};
var $author$project$MicroAgda$Drawing$toRenderableAll = function (l) {
	var allR = A2($elm$core$List$filterMap, $author$project$MicroAgda$Drawing$toRenderable, l);
	return A2(
		$elm$core$List$map,
		$elm$core$Tuple$first,
		$elm$core$List$concat(
			_List_fromArray(
				[
					A2(
					$elm$core$List$filter,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Tuple$second,
						$author$project$ResultExtra$isEqual(2)),
					allR),
					A2(
					$elm$core$List$filter,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Tuple$second,
						$author$project$ResultExtra$isEqual(1)),
					allR),
					A2(
					$elm$core$List$filter,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Tuple$second,
						$author$project$ResultExtra$isEqual(0)),
					allR)
				])));
};
var $author$project$Gui$Draw$drawingHTML = A2(
	$elm$core$Basics$composeR,
	$elm$core$Maybe$withDefault($author$project$Gui$Draw$defaultDrawingHTMLSettings),
	function (ds) {
		var width = ds.width;
		var height = ds.height;
		var bgshp = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				function (x) {
					return _List_fromArray(
						[
							A2(
							$joakin$elm_canvas$Canvas$shapes,
							_List_fromArray(
								[
									$joakin$elm_canvas$Canvas$Settings$fill(x)
								]),
							_List_fromArray(
								[
									A3(
									$joakin$elm_canvas$Canvas$rect,
									_Utils_Tuple2(0, 0),
									width,
									height)
								]))
						]);
				},
				ds.bgColor));
		return A2(
			$elm$core$Basics$composeR,
			$author$project$MicroAgda$Drawing$pxScale(
				_Utils_Tuple2(width, height)),
			A2(
				$elm$core$Basics$composeR,
				$author$project$MicroAgda$Drawing$toRenderableAll,
				function (rls) {
					return A3(
						$joakin$elm_canvas$Canvas$toHtml,
						_Utils_Tuple2(width, height),
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'width', '100%'),
								A2($elm$html$Html$Attributes$style, 'heigth', '100%')
							]),
						_Utils_ap(
							_List_fromArray(
								[
									A3(
									$joakin$elm_canvas$Canvas$clear,
									_Utils_Tuple2(0, 0),
									width,
									height)
								]),
							A2($elm$core$List$append, bgshp, rls)));
				}));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$unstyledNode = $rtfeldman$elm_css$VirtualDom$Styled$Unstyled;
var $rtfeldman$elm_css$Html$Styled$fromUnstyled = $rtfeldman$elm_css$VirtualDom$Styled$unstyledNode;
var $author$project$MicroAgda$Viz$Gui$lowDimFactor = 4;
var $author$project$MicroAgda$Viz$Gui$handleDifrentDims = F4(
	function (ls, s, n, drw0) {
		var viz2 = function (drw) {
			return $elm$core$Result$Ok(
				A2(
					$author$project$Gui$Draw$drawingHTML,
					$elm$core$Maybe$Just(s),
					drw));
		};
		var viz1 = function (drw) {
			return $elm$core$Result$Ok(
				A2(
					$author$project$Gui$Draw$drawingHTML,
					$elm$core$Maybe$Just(
						_Utils_update(
							s,
							{width: (s.width / $author$project$MicroAgda$Viz$Gui$lowDimFactor) | 0})),
					A2($author$project$MicroAgda$Drawing$degenDrawing, 0, drw)));
		};
		var viz0 = function (drw) {
			return $elm$core$Result$Ok(
				A2(
					$author$project$Gui$Draw$drawingHTML,
					$elm$core$Maybe$Just(
						_Utils_update(
							s,
							{height: (s.width / $author$project$MicroAgda$Viz$Gui$lowDimFactor) | 0, width: (s.width / $author$project$MicroAgda$Viz$Gui$lowDimFactor) | 0})),
					A2(
						$author$project$MicroAgda$Drawing$degenDrawing,
						1,
						A2($author$project$MicroAgda$Drawing$degenDrawing, 0, drw))));
		};
		return A2(
			$elm$core$Result$map,
			function (canv) {
				return A2(
					$rtfeldman$elm_css$Html$Styled$div,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$css(ls)
						]),
					_List_fromArray(
						[canv]));
			},
			A2(
				$elm$core$Result$map,
				$rtfeldman$elm_css$Html$Styled$fromUnstyled,
				function () {
					switch (n) {
						case 0:
							return viz0(drw0);
						case 1:
							return viz1(drw0);
						case 2:
							return viz2(drw0);
						default:
							return $elm$core$Result$Err(
								'visuzalization of terms in ' + ($elm$core$String$fromInt(n) + ' dimension not suported yet'));
					}
				}()));
	});
var $author$project$MicroAgda$Viz$Gui$labelCss = _List_fromArray(
	[
		$rtfeldman$elm_css$Css$fontSize(
		$rtfeldman$elm_css$Css$px(14)),
		$rtfeldman$elm_css$Css$fontFamily($rtfeldman$elm_css$Css$monospace),
		$rtfeldman$elm_css$Css$textAlign($rtfeldman$elm_css$Css$center),
		$rtfeldman$elm_css$Css$backgroundColor(
		A3($rtfeldman$elm_css$Css$rgb, 230, 230, 230)),
		$rtfeldman$elm_css$Css$padding(
		$rtfeldman$elm_css$Css$px(4))
	]);
var $author$project$MicroAgda$Internal$TranslatePretty$ct2str = function (c) {
	return A2(
		$elm$core$Basics$composeR,
		$author$project$MicroAgda$Internal$Ctx$toTm,
		A2(
			$elm$core$Basics$composeR,
			A2($author$project$MicroAgda$Internal$TranslatePretty$internal2raw, c, _List_Nil),
			$author$project$MicroAgda$Raw$raw2String));
};
var $author$project$MicroAgda$Viz$Gui$mkLabelTy = F2(
	function (c, ct) {
		return A2(
			$elm$core$Maybe$withDefault,
			'???',
			A2(
				$elm$core$Maybe$map,
				function (art) {
					return A2($author$project$MicroAgda$Internal$TranslatePretty$ct2str, c, ct);
				},
				$author$project$MicroAgda$Internal$Ctx$arity(ct)));
	});
var $rtfeldman$elm_css$Html$Styled$strong = $rtfeldman$elm_css$Html$Styled$node('strong');
var $author$project$ResultExtra$uncurry = F2(
	function (f, _v0) {
		var a = _v0.a;
		var b = _v0.b;
		return A2(f, a, b);
	});
var $author$project$MicroAgda$Viz$Gui$ctxHtml = function (dc) {
	var c = $author$project$MicroAgda$Viz$Structures$toCtx(dc);
	return A2(
		$author$project$MicroAgda$Viz$Structures$describeErr,
		'ctxHtml',
		A2(
			$elm$core$Result$map,
			function (rows) {
				return A2(
					$author$project$MicroAgda$Viz$CodeViz$toolBoxWin,
					'generated generic arguments',
					A2($rtfeldman$elm_css$Html$Styled$div, _List_Nil, rows));
			},
			A2(
				$elm$core$Result$map,
				$elm$core$List$map(
					function (_v4) {
						var n = _v4.a;
						var lst = _v4.b;
						return A2(
							$rtfeldman$elm_css$Html$Styled$div,
							_List_fromArray(
								[$author$project$MicroAgda$Viz$Gui$ctxCellsRowStyle]),
							_List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Html$Styled$div,
									_List_Nil,
									A2(
										$elm$core$List$map,
										A2(
											$elm$core$Basics$composeR,
											$elm$core$Tuple$second,
											$rtfeldman$elm_css$Html$Styled$div(
												_List_fromArray(
													[$author$project$MicroAgda$Viz$Gui$ctxCellStyle]))),
										lst))
								]));
					}),
				A2(
					$elm$core$Result$map,
					$author$project$ResultExtra$gatherByInt($elm$core$Tuple$first),
					A2(
						$elm$core$Result$map,
						$elm$core$List$filterMap($elm$core$Basics$identity),
						A2(
							$author$project$ResultExtra$mapListResult,
							function (_v0) {
								var i = _v0.a;
								var _v1 = _v0.b;
								var vName = _v1.a;
								var ct = _v1.b;
								var mb = _v1.c;
								var labelR = $elm$core$Result$Ok(
									A2(
										$rtfeldman$elm_css$Html$Styled$div,
										_List_fromArray(
											[
												$rtfeldman$elm_css$Html$Styled$Attributes$css($author$project$MicroAgda$Viz$Gui$labelCss)
											]),
										_List_fromArray(
											[
												A2(
												$rtfeldman$elm_css$Html$Styled$strong,
												_List_Nil,
												_List_fromArray(
													[
														$rtfeldman$elm_css$Html$Styled$text(vName)
													])),
												A2(
												$rtfeldman$elm_css$Html$Styled$div,
												_List_Nil,
												_List_fromArray(
													[
														$rtfeldman$elm_css$Html$Styled$text(
														A2($author$project$MicroAgda$Viz$Gui$mkLabelTy, c, ct))
													]))
											])));
								return A2(
									$elm$core$Result$andThen,
									function (label) {
										return A2(
											$elm$core$Maybe$withDefault,
											$elm$core$Result$Ok($elm$core$Maybe$Nothing),
											A2(
												$elm$core$Maybe$map,
												function (ec) {
													if (ec.$ === 'EInterval') {
														return $elm$core$Result$Ok($elm$core$Maybe$Nothing);
													} else {
														var _v3 = ec.a;
														var n = _v3.a;
														return A2(
															$elm$core$Result$map,
															$elm$core$Maybe$map(
																$elm$core$Tuple$pair(n)),
															A2(
																$elm$core$Result$map,
																function (x) {
																	return $elm$core$Maybe$Just(
																		_List_fromArray(
																			[x, label]));
																},
																A2(
																	$elm$core$Result$andThen,
																	$author$project$ResultExtra$uncurry(
																		A2(
																			$author$project$MicroAgda$Viz$Gui$handleDifrentDims,
																			_List_fromArray(
																				[
																					$rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$inlineBlock)
																				]),
																			$author$project$MicroAgda$Viz$Gui$ctxIconS)),
																	A2($author$project$MicroAgda$Viz$Process$drawGenericTerm, dc, i))));
													}
												},
												mb));
									},
									labelR);
							},
							A2(
								$elm$core$List$indexedMap,
								$elm$core$Tuple$pair,
								$elm$core$List$reverse(dc.list))))))));
};
var $rtfeldman$elm_css$Css$auto = {alignItemsOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible, cursor: $rtfeldman$elm_css$Css$Structure$Compatible, flexBasis: $rtfeldman$elm_css$Css$Structure$Compatible, intOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible, justifyContentOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible, lengthOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible, lengthOrAutoOrCoverOrContain: $rtfeldman$elm_css$Css$Structure$Compatible, lengthOrNumberOrAutoOrNoneOrContent: $rtfeldman$elm_css$Css$Structure$Compatible, overflow: $rtfeldman$elm_css$Css$Structure$Compatible, pointerEvents: $rtfeldman$elm_css$Css$Structure$Compatible, tableLayout: $rtfeldman$elm_css$Css$Structure$Compatible, textRendering: $rtfeldman$elm_css$Css$Structure$Compatible, touchAction: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'auto'};
var $rtfeldman$elm_css$Css$fixed = {backgroundAttachment: $rtfeldman$elm_css$Css$Structure$Compatible, position: $rtfeldman$elm_css$Css$Structure$Compatible, tableLayout: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'fixed'};
var $rtfeldman$elm_css$Css$height = $rtfeldman$elm_css$Css$prop1('height');
var $rtfeldman$elm_css$Css$UnitlessInteger = {$: 'UnitlessInteger'};
var $rtfeldman$elm_css$Css$int = function (val) {
	return {
		fontWeight: $rtfeldman$elm_css$Css$Structure$Compatible,
		intOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible,
		lengthOrNumber: $rtfeldman$elm_css$Css$Structure$Compatible,
		lengthOrNumberOrAutoOrNoneOrContent: $rtfeldman$elm_css$Css$Structure$Compatible,
		number: $rtfeldman$elm_css$Css$Structure$Compatible,
		numberOrInfinite: $rtfeldman$elm_css$Css$Structure$Compatible,
		numericValue: val,
		unitLabel: '',
		units: $rtfeldman$elm_css$Css$UnitlessInteger,
		value: $elm$core$String$fromInt(val)
	};
};
var $rtfeldman$elm_css$Css$left = $rtfeldman$elm_css$Css$prop1('left');
var $rtfeldman$elm_css$Css$overflow = $rtfeldman$elm_css$Css$prop1('overflow');
var $rtfeldman$elm_css$Css$position = $rtfeldman$elm_css$Css$prop1('position');
var $rtfeldman$elm_css$Css$VhUnits = {$: 'VhUnits'};
var $rtfeldman$elm_css$Css$vh = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, $rtfeldman$elm_css$Css$VhUnits, 'vh');
var $rtfeldman$elm_css$Css$VwUnits = {$: 'VwUnits'};
var $rtfeldman$elm_css$Css$vw = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, $rtfeldman$elm_css$Css$VwUnits, 'vw');
var $rtfeldman$elm_css$Css$width = $rtfeldman$elm_css$Css$prop1('width');
var $rtfeldman$elm_css$Css$zIndex = $rtfeldman$elm_css$Css$prop1('z-index');
var $author$project$MicroAgda$Viz$Gui$fullWindow = $rtfeldman$elm_css$Html$Styled$div(
	_List_fromArray(
		[
			$rtfeldman$elm_css$Html$Styled$Attributes$css(
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$fixed),
					A2($rtfeldman$elm_css$Css$property, 'display', 'flex'),
					$rtfeldman$elm_css$Css$width(
					$rtfeldman$elm_css$Css$vw(100)),
					$rtfeldman$elm_css$Css$height(
					$rtfeldman$elm_css$Css$vh(100)),
					$rtfeldman$elm_css$Css$top(
					$rtfeldman$elm_css$Css$px(0)),
					$rtfeldman$elm_css$Css$left(
					$rtfeldman$elm_css$Css$px(0)),
					$rtfeldman$elm_css$Css$zIndex(
					$rtfeldman$elm_css$Css$int(1000)),
					$rtfeldman$elm_css$Css$backgroundColor(
					A3($rtfeldman$elm_css$Css$rgb, 255, 255, 255)),
					$rtfeldman$elm_css$Css$overflow($rtfeldman$elm_css$Css$auto)
				]))
		]));
var $rtfeldman$elm_css$Css$absolute = {position: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'absolute'};
var $rtfeldman$elm_css$VirtualDom$Styled$property = F2(
	function (key, value) {
		return A3(
			$rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$property, key, value),
			_List_Nil,
			'');
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$id = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('id');
var $elm$html$Html$div = _VirtualDom_node('div');
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$setLineDash = function (segments) {
	return A2(
		$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
		'setLineDash',
		_List_fromArray(
			[
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$float, segments)
			]));
};
var $joakin$elm_canvas$Canvas$Settings$Line$lineDash = function (dashSettings) {
	return $joakin$elm_canvas$Canvas$Internal$Canvas$SettingCommand(
		$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$setLineDash(dashSettings));
};
var $author$project$ResultExtra$mapSame = function (f) {
	return A2($elm$core$Tuple$mapBoth, f, f);
};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions = {preventDefault: true, stopPropagation: false};
var $elm$virtual_dom$VirtualDom$Custom = function (a) {
	return {$: 'Custom', a: a};
};
var $elm$html$Html$Events$custom = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Custom(decoder));
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$Event = F6(
	function (keys, button, clientPos, offsetPos, pagePos, screenPos) {
		return {button: button, clientPos: clientPos, keys: keys, offsetPos: offsetPos, pagePos: pagePos, screenPos: screenPos};
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$BackButton = {$: 'BackButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ErrorButton = {$: 'ErrorButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ForwardButton = {$: 'ForwardButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MainButton = {$: 'MainButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MiddleButton = {$: 'MiddleButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$SecondButton = {$: 'SecondButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonFromId = function (id) {
	switch (id) {
		case 0:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MainButton;
		case 1:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MiddleButton;
		case 2:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$SecondButton;
		case 3:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$BackButton;
		case 4:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ForwardButton;
		default:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ErrorButton;
	}
};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonDecoder = A2(
	$elm$json$Json$Decode$map,
	$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonFromId,
	A2($elm$json$Json$Decode$field, 'button', $elm$json$Json$Decode$int));
var $mpizenberg$elm_pointer_events$Internal$Decode$clientPos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'clientX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'clientY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Internal$Decode$Keys = F3(
	function (alt, ctrl, shift) {
		return {alt: alt, ctrl: ctrl, shift: shift};
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$json$Json$Decode$map3 = _Json_map3;
var $mpizenberg$elm_pointer_events$Internal$Decode$keys = A4(
	$elm$json$Json$Decode$map3,
	$mpizenberg$elm_pointer_events$Internal$Decode$Keys,
	A2($elm$json$Json$Decode$field, 'altKey', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'ctrlKey', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'shiftKey', $elm$json$Json$Decode$bool));
var $elm$json$Json$Decode$map6 = _Json_map6;
var $mpizenberg$elm_pointer_events$Internal$Decode$offsetPos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'offsetX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'offsetY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Internal$Decode$pagePos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'pageX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'pageY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Internal$Decode$screenPos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'screenX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'screenY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$eventDecoder = A7($elm$json$Json$Decode$map6, $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$Event, $mpizenberg$elm_pointer_events$Internal$Decode$keys, $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonDecoder, $mpizenberg$elm_pointer_events$Internal$Decode$clientPos, $mpizenberg$elm_pointer_events$Internal$Decode$offsetPos, $mpizenberg$elm_pointer_events$Internal$Decode$pagePos, $mpizenberg$elm_pointer_events$Internal$Decode$screenPos);
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions = F3(
	function (event, options, tag) {
		return A2(
			$elm$html$Html$Events$custom,
			event,
			A2(
				$elm$json$Json$Decode$map,
				function (ev) {
					return {
						message: tag(ev),
						preventDefault: options.preventDefault,
						stopPropagation: options.stopPropagation
					};
				},
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$eventDecoder));
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onDown = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mousedown', $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var $author$project$MicroAgda$Viz$FloatFunctions$actOnArr = F2(
	function (f, l) {
		return A3(
			$author$project$ResultExtra$swapFn,
			$elm$core$List$indexedMap,
			l,
			A2(
				$elm$core$Basics$composeR,
				f(
					A2(
						$elm$core$Basics$composeR,
						$author$project$ResultExtra$lookByIntInList(l),
						$elm$core$Maybe$withDefault(0))),
				$author$project$ResultExtra$const));
	});
var $author$project$MicroAgda$Viz$FloatFunctions$centerTrans = F2(
	function (compPar, x) {
		return ((x - 0.5) * (1 / (1 - (compPar * 2)))) + 0.5;
	});
var $author$project$MicroAgda$Viz$FloatFunctions$sideTrans = F5(
	function (compPar, _v0, sk, f, k) {
		var i = _v0.a;
		var b = _v0.b;
		var q = f(i);
		var z = b ? (1 - ((1 - q) * (1 / compPar))) : (1 - (q * (1 / compPar)));
		return _Utils_eq(k, i) ? A2($author$project$MicroAgda$Viz$FloatFunctions$vertSideFix, compPar, z) : (sk ? (((f(k) - 0.5) * (1 / A3(
			$author$project$ResultExtra$interp,
			$author$project$MicroAgda$Viz$FloatFunctions$centerW(compPar),
			1,
			z))) + 0.5) : ((f(k) - 0.5) + 0.5));
	});
var $author$project$ResultExtra$updateInList = F3(
	function (i, a, l) {
		var _v0 = _Utils_Tuple2(l, i);
		if (!_v0.a.b) {
			return _List_Nil;
		} else {
			if (!_v0.b) {
				var _v1 = _v0.a;
				var x = _v1.a;
				var xs = _v1.b;
				return A2($elm$core$List$cons, a, xs);
			} else {
				var _v2 = _v0.a;
				var x = _v2.a;
				var xs = _v2.b;
				return A2(
					$elm$core$List$cons,
					x,
					A3($author$project$ResultExtra$updateInList, i - 1, a, xs));
			}
		}
	});
var $author$project$ResultExtra$swapLastWithIth = F2(
	function (k, l) {
		var j = $elm$core$List$length(l) - 1;
		return A2(
			$elm$core$Maybe$withDefault,
			l,
			A3(
				$elm$core$Basics$apR,
				A2($author$project$ResultExtra$lookByIntInList, l, j),
				$elm$core$Maybe$map2(
					function (h) {
						return function (x) {
							return A3(
								$author$project$ResultExtra$updateInList,
								j,
								x,
								A3($author$project$ResultExtra$updateInList, k, h, l));
						};
					}),
				A2($author$project$ResultExtra$lookByIntInList, l, k)));
	});
var $author$project$MicroAgda$Viz$Process$pointDettect = F2(
	function (pt, ca) {
		var param = $author$project$MicroAgda$Viz$FloatFunctions$defaultCompPar;
		var n = $elm$core$List$length(pt);
		if (ca.$ === 'Cub') {
			return $elm$core$Maybe$Just(_List_Nil);
		} else {
			var si = ca.c;
			var cup = ca.d;
			var arr = function (i) {
				return A2(
					$elm$core$Maybe$withDefault,
					0,
					A2($author$project$ResultExtra$lookByIntInList, pt, i));
			};
			var _v1 = A3($author$project$MicroAgda$Viz$FloatFunctions$sideGet, param, n, arr);
			if (_v1.$ === 'Nothing') {
				return A2(
					$elm$core$Maybe$map,
					function (x) {
						return A2(
							$elm$core$List$cons,
							$author$project$Combinatorics$subFaceCenter(n),
							x);
					},
					A2(
						$author$project$MicroAgda$Viz$Process$pointDettect,
						A2(
							$elm$core$List$map,
							$author$project$MicroAgda$Viz$FloatFunctions$centerTrans(param),
							pt),
						cup));
			} else {
				var _v2 = _v1.a;
				var _v3 = _v2.a;
				var i = _v3.a;
				var b = _v2.b;
				var f = _Utils_Tuple2(i, b);
				var sf = A2($author$project$Combinatorics$faceToSubFace, n, f);
				return A2(
					$elm$core$Maybe$map,
					function (addr) {
						return A2($elm$core$List$cons, sf, addr);
					},
					A2(
						$elm$core$Maybe$andThen,
						$author$project$MicroAgda$Viz$Process$pointDettect(
							A2(
								$author$project$ResultExtra$swapLastWithIth,
								i,
								A2(
									$author$project$MicroAgda$Viz$FloatFunctions$actOnArr,
									A3($author$project$MicroAgda$Viz$FloatFunctions$sideTrans, param, f, true),
									pt))),
						si(sf)));
			}
		}
	});
var $author$project$MicroAgda$Viz$Gui$relativePos = function (mouseEvent) {
	return mouseEvent.offsetPos;
};
var $avh4$elm_color$Color$rgba = F4(
	function (r, g, b, a) {
		return A4($avh4$elm_color$Color$RgbaSpace, r, g, b, a);
	});
var $author$project$MicroAgda$Viz$Structures$flipAddress = function (k) {
	return $elm$core$List$map(
		A2(
			$author$project$Combinatorics$mapAsList,
			$author$project$Combinatorics$subFaceLI,
			$author$project$ResultExtra$swapLastWithIth(k)));
};
var $author$project$Combinatorics$subFaceCases = function (sf) {
	return $elm$core$List$isEmpty(
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			$author$project$Combinatorics$subFaceLI.toL(sf))) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(sf);
};
var $author$project$MicroAgda$Viz$Structures$toPreOF = function (adrs) {
	if (!adrs.b) {
		return _List_Nil;
	} else {
		var h = adrs.a;
		var tl = adrs.b;
		return A2(
			$elm$core$List$cons,
			h,
			function () {
				var tll = $author$project$MicroAgda$Viz$Structures$toPreOF(tl);
				var _v1 = $author$project$Combinatorics$subFaceCases(h);
				if (_v1.$ === 'Nothing') {
					return tll;
				} else {
					var sf = _v1.a;
					var _v2 = $author$project$Combinatorics$toFaceForce(sf);
					if (_v2.$ === 'Nothing') {
						return _List_Nil;
					} else {
						var _v3 = _v2.a;
						var k = _v3.a;
						var b = _v3.b;
						return A2($author$project$MicroAgda$Viz$Structures$flipAddress, k, tll);
					}
				}
			}());
	}
};
var $author$project$MicroAgda$Viz$Process$transAddressUF = function (address) {
	if (!address.b) {
		return $elm$core$Basics$identity;
	} else {
		var h = address.a;
		var tl = address.b;
		var n = A2($author$project$Combinatorics$lengthLI, $author$project$Combinatorics$subFaceLI, h);
		return A2(
			$elm$core$Basics$composeR,
			$author$project$MicroAgda$Viz$Process$transAddressUF(tl),
			function () {
				var _v1 = $author$project$Combinatorics$subFaceCases(h);
				if (_v1.$ === 'Nothing') {
					return A2($author$project$MicroAgda$Viz$Process$centerTransDrw, $author$project$MicroAgda$Viz$FloatFunctions$defaultCompPar, n);
				} else {
					var sf = _v1.a;
					return A2(
						$elm$core$Basics$composeR,
						$author$project$ResultExtra$pairR(true),
						A2($author$project$MicroAgda$Viz$Process$sideTransSF, $author$project$MicroAgda$Viz$FloatFunctions$defaultCompPar, sf));
				}
			}());
	}
};
var $author$project$MicroAgda$Viz$Process$transAddress = A2($elm$core$Basics$composeR, $author$project$MicroAgda$Viz$Structures$toPreOF, $author$project$MicroAgda$Viz$Process$transAddressUF);
var $author$project$MicroAgda$Drawing$unmasked = $author$project$MicroAgda$Drawing$mapDrawingData(
	A2(
		$elm$core$Basics$composeR,
		$elm$core$Tuple$pair(false),
		$elm$core$Maybe$Just));
var $author$project$MicroAgda$Viz$Gui$inspectorOverlay = F4(
	function (mba, bigCanvasSize, ca, n) {
		var selShp = function (addrs) {
			return $author$project$MicroAgda$Drawing$combineDrawings(
				_List_fromArray(
					[
						_List_fromArray(
						[
							_Utils_Tuple2(
							$author$project$MicroAgda$Drawing$unitHyCube(2),
							_Utils_Tuple2(
								A4($avh4$elm_color$Color$rgba, 0, 0, 0, 0.5),
								_List_Nil))
						]),
						A2(
						$author$project$MicroAgda$Viz$Process$outlineNd,
						2,
						_Utils_Tuple2(
							$avh4$elm_color$Color$black,
							_List_fromArray(
								[
									$joakin$elm_canvas$Canvas$Settings$Line$lineWidth(4)
								]))),
						A2(
						$author$project$MicroAgda$Viz$Process$outlineNd,
						2,
						_Utils_Tuple2(
							$avh4$elm_color$Color$white,
							_List_fromArray(
								[
									$joakin$elm_canvas$Canvas$Settings$Line$lineWidth(2),
									$joakin$elm_canvas$Canvas$Settings$Line$lineDash(
									_List_fromArray(
										[5, 5]))
								])))
					]));
		};
		var bcs = {bgColor: $elm$core$Maybe$Nothing, height: bigCanvasSize, width: bigCanvasSize};
		return $elm$core$List$singleton(
			$rtfeldman$elm_css$Html$Styled$fromUnstyled(
				A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onDown(
							A2(
								$elm$core$Basics$composeR,
								$author$project$MicroAgda$Viz$Gui$relativePos,
								A2(
									$elm$core$Basics$composeR,
									$author$project$ResultExtra$mapSame(
										function (x) {
											return x / bigCanvasSize;
										}),
									function (_v0) {
										var x = _v0.a;
										var y = _v0.b;
										return A2(
											$author$project$MicroAgda$Viz$Process$pointDettect,
											_List_fromArray(
												[x, y]),
											ca);
									})))
						]),
					$elm$core$List$singleton(
						A2(
							$author$project$Gui$Draw$drawingHTML,
							$elm$core$Maybe$Just(bcs),
							A2(
								$elm$core$Maybe$withDefault,
								_List_Nil,
								A2(
									$elm$core$Maybe$map,
									function (addrs) {
										return A2(
											$author$project$MicroAgda$Viz$Process$transAddress,
											addrs,
											$author$project$MicroAgda$Drawing$unmasked(
												selShp(addrs)));
									},
									mba)))))));
	});
var $author$project$ResultExtra$errHtml = A2(
	$author$project$ResultExtra$convergeResult,
	A2(
		$elm$core$Basics$composeR,
		$rtfeldman$elm_css$Html$Styled$text,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$singleton,
			$rtfeldman$elm_css$Html$Styled$div(_List_Nil))),
	$elm$core$Basics$identity);
var $elm$virtual_dom$VirtualDom$lazy2 = _VirtualDom_lazy2;
var $rtfeldman$elm_css$VirtualDom$Styled$lazyHelp = F2(
	function (fn, arg) {
		return $rtfeldman$elm_css$VirtualDom$Styled$toUnstyled(
			fn(arg));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$lazy = F2(
	function (fn, arg) {
		return $rtfeldman$elm_css$VirtualDom$Styled$Unstyled(
			A3($elm$virtual_dom$VirtualDom$lazy2, $rtfeldman$elm_css$VirtualDom$Styled$lazyHelp, fn, arg));
	});
var $rtfeldman$elm_css$Html$Styled$Lazy$lazy = $rtfeldman$elm_css$VirtualDom$Styled$lazy;
var $author$project$ResultExtra$lazyResHtml = F2(
	function (f, a) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$Lazy$lazy,
			A2($elm$core$Basics$composeR, f, $author$project$ResultExtra$errHtml),
			a);
	});
var $rtfeldman$elm_css$Css$animationDuration = function (arg) {
	return A2($rtfeldman$elm_css$Css$prop1, 'animation-duration', arg);
};
var $rtfeldman$elm_css$Css$Preprocess$WithKeyframes = function (a) {
	return {$: 'WithKeyframes', a: a};
};
var $rtfeldman$elm_css$Css$animationName = function (arg) {
	return ((arg.value === 'none') || ((arg.value === 'inherit') || ((arg.value === 'unset') || (arg.value === 'initial')))) ? A2($rtfeldman$elm_css$Css$prop1, 'animation-name', arg) : $rtfeldman$elm_css$Css$Preprocess$WithKeyframes(arg.value);
};
var $rtfeldman$elm_css$Css$Internal$printKeyframeSelector = function (_v0) {
	var percentage = _v0.a;
	var properties = _v0.b;
	var propertiesStr = A2(
		$elm$core$String$join,
		'',
		A2(
			$elm$core$List$map,
			function (_v1) {
				var prop = _v1.a;
				return prop + ';';
			},
			properties));
	var percentageStr = $elm$core$String$fromInt(percentage) + '%';
	return percentageStr + (' {' + (propertiesStr + '}'));
};
var $rtfeldman$elm_css$Css$Internal$compileKeyframes = function (tuples) {
	return A2(
		$elm$core$String$join,
		'\n\n',
		A2($elm$core$List$map, $rtfeldman$elm_css$Css$Internal$printKeyframeSelector, tuples));
};
var $rtfeldman$elm_css$Css$Animations$keyframes = function (tuples) {
	return $elm$core$List$isEmpty(tuples) ? {keyframes: $rtfeldman$elm_css$Css$Structure$Compatible, none: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'none'} : {
		keyframes: $rtfeldman$elm_css$Css$Structure$Compatible,
		none: $rtfeldman$elm_css$Css$Structure$Compatible,
		value: $rtfeldman$elm_css$Css$Internal$compileKeyframes(tuples)
	};
};
var $rtfeldman$elm_css$Css$Internal$Property = function (a) {
	return {$: 'Property', a: a};
};
var $rtfeldman$elm_css$Css$Animations$property = F2(
	function (key, value) {
		return $rtfeldman$elm_css$Css$Internal$Property(key + (':' + value));
	});
var $rtfeldman$elm_css$Css$sec = function (amount) {
	return {
		duration: $rtfeldman$elm_css$Css$Structure$Compatible,
		value: $elm$core$String$fromFloat(amount) + 's'
	};
};
var $author$project$MicroAgda$Viz$Gui$pulsationAmination = function () {
	var kfms = $rtfeldman$elm_css$Css$Animations$keyframes(
		_List_fromArray(
			[
				_Utils_Tuple2(
				0,
				_List_fromArray(
					[
						A2($rtfeldman$elm_css$Css$Animations$property, 'opacity', '1')
					])),
				_Utils_Tuple2(
				80,
				_List_fromArray(
					[
						A2($rtfeldman$elm_css$Css$Animations$property, 'opacity', '0.2')
					]))
			]));
	return _List_fromArray(
		[
			$rtfeldman$elm_css$Css$animationName(kfms),
			$rtfeldman$elm_css$Css$animationDuration(
			$rtfeldman$elm_css$Css$sec(1)),
			A2($rtfeldman$elm_css$Css$property, 'animation-iteration-count', 'infinite')
		]);
}();
var $rtfeldman$elm_css$Css$relative = {position: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'relative'};
var $author$project$MicroAgda$Viz$Gui$inspectorCanvas = F5(
	function (mba, bigCanvasSize, n, ca, drw0) {
		var overlayCanv = A4($author$project$MicroAgda$Viz$Gui$inspectorOverlay, mba, bigCanvasSize, ca, n);
		var bcs = {
			bgColor: $elm$core$Maybe$Just($avh4$elm_color$Color$white),
			height: bigCanvasSize,
			width: bigCanvasSize
		};
		var drawingCanv = A2(
			$author$project$ResultExtra$lazyResHtml,
			A3($author$project$MicroAgda$Viz$Gui$handleDifrentDims, _List_Nil, bcs, n),
			drw0);
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$relative)
						])),
					$rtfeldman$elm_css$Html$Styled$Attributes$id('inspectorBox')
				]),
			_List_fromArray(
				[
					drawingCanv,
					A2(
					$rtfeldman$elm_css$Html$Styled$div,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$css(
							_Utils_ap(
								_List_fromArray(
									[
										$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$absolute),
										$rtfeldman$elm_css$Css$top(
										$rtfeldman$elm_css$Css$px(0)),
										$rtfeldman$elm_css$Css$left(
										$rtfeldman$elm_css$Css$px(0))
									]),
								$author$project$MicroAgda$Viz$Gui$pulsationAmination))
						]),
					overlayCanv)
				]));
	});
var $rtfeldman$elm_css$Css$minWidth = $rtfeldman$elm_css$Css$prop1('min-width');
var $author$project$MicroAgda$Internal$TranslatePretty$t2strNoCtx = $author$project$MicroAgda$Internal$TranslatePretty$t2str($author$project$MicroAgda$Internal$Ctx$emptyCtx);
var $author$project$MicroAgda$Viz$CodeViz$signatureVizHtml = function (ct) {
	return A2(
		$elm$core$Result$map,
		function (x) {
			return A2(
				$author$project$MicroAgda$Viz$CodeViz$toolBoxWin,
				'type (sginature)',
				A2(
					$rtfeldman$elm_css$Html$Styled$div,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$css(
							_List_fromArray(
								[
									$rtfeldman$elm_css$Css$fontFamily($rtfeldman$elm_css$Css$monospace),
									$rtfeldman$elm_css$Css$padding(
									$rtfeldman$elm_css$Css$px(4))
								]))
						]),
					_List_fromArray(
						[x])));
		},
		$elm$core$Result$Ok(
			$rtfeldman$elm_css$Html$Styled$text(
				$author$project$MicroAgda$Internal$TranslatePretty$t2strNoCtx(
					$author$project$MicroAgda$Internal$Ctx$toTm(ct)))));
};
var $author$project$MicroAgda$Viz$Gui$vizHtmlWindow = function (mba) {
	var bigCanvasSize = 1024;
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$Result$andThen(
			function (_v0) {
				var _v1 = _v0.a;
				var ct = _v1.a;
				var tm = _v1.b;
				var mbDone = _v0.b;
				return A2(
					$elm$core$Result$andThen,
					function (_v3) {
						var dc = _v3.a;
						var n = _v3.b;
						var _v4 = _v3.c;
						var cn2 = _v4.a;
						var drw0 = _v4.b;
						return A2(
							$elm$core$Result$map,
							A2(
								$elm$core$Basics$composeR,
								$author$project$MicroAgda$Viz$Gui$fullWindow,
								$rtfeldman$elm_css$Html$Styled$map(
									$author$project$ResultExtra$pairR(
										$elm$core$Maybe$Just(
											_Utils_Tuple3(
												dc,
												n,
												_Utils_Tuple2(cn2, drw0)))))),
							A2(
								$author$project$ResultExtra$mapListResult,
								$elm$core$Basics$identity,
								$elm$core$List$reverse(
									_List_fromArray(
										[
											A2(
											$elm$core$Result$map,
											$rtfeldman$elm_css$Html$Styled$div(
												_List_fromArray(
													[
														$rtfeldman$elm_css$Html$Styled$Attributes$css(
														_List_fromArray(
															[
																$rtfeldman$elm_css$Css$minWidth(
																$rtfeldman$elm_css$Css$px(250))
															]))
													])),
											$elm$core$Result$Ok(
												_List_fromArray(
													[
														A2($author$project$ResultExtra$lazyResHtml, $author$project$MicroAgda$Viz$CodeViz$signatureVizHtml, ct),
														A2(
														$author$project$ResultExtra$lazyResHtml,
														function (_v5) {
															var _v6 = _v5.a;
															var mbaA = _v6.a;
															var dcA = _v6.b;
															var _v7 = _v5.b;
															var nA = _v7.a;
															var cn2A = _v7.b;
															return A4($author$project$MicroAgda$Viz$CodeViz$codeVizHtml, mbaA, dcA, nA, cn2A);
														},
														_Utils_Tuple2(
															_Utils_Tuple2(mba, dc),
															_Utils_Tuple2(n, cn2))),
														A2($author$project$ResultExtra$lazyResHtml, $author$project$MicroAgda$Viz$Gui$ctxHtml, dc)
													]))),
											A2(
											$elm$core$Result$map,
											A2(
												$elm$core$Basics$composeR,
												$elm$core$List$singleton,
												$rtfeldman$elm_css$Html$Styled$div(
													_List_fromArray(
														[
															$rtfeldman$elm_css$Html$Styled$Attributes$css(
															_List_fromArray(
																[
																	$rtfeldman$elm_css$Css$width(
																	$rtfeldman$elm_css$Css$px(bigCanvasSize)),
																	$rtfeldman$elm_css$Css$height(
																	$rtfeldman$elm_css$Css$px(bigCanvasSize)),
																	$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$relative)
																]))
														]))),
											$elm$core$Result$Ok(
												A5($author$project$MicroAgda$Viz$Gui$inspectorCanvas, mba, bigCanvasSize, n, cn2, drw0)))
										]))));
					},
					function () {
						if (mbDone.$ === 'Just') {
							var x = mbDone.a;
							return $elm$core$Result$Ok(x);
						} else {
							return $author$project$MicroAgda$Viz$Process$allWork(
								_Utils_Tuple2(ct, tm));
						}
					}());
			}),
		A2(
			$author$project$ResultExtra$convergeResult,
			function (s) {
				return A2(
					$rtfeldman$elm_css$Html$Styled$map,
					$author$project$ResultExtra$pairR($elm$core$Maybe$Nothing),
					A3(
						$rtfeldman$elm_css$Html$Styled$node,
						'pre',
						_List_Nil,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Html$Styled$text(s)
							])));
			},
			$elm$core$Basics$identity));
};
var $author$project$Main$drawnHtmlWindow = function (model) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$map,
		function (_v0) {
			var mbA = _v0.a;
			var cache = _v0.b;
			return A2($author$project$Main$FromWindow, mbA, cache);
		},
		A2(
			$author$project$MicroAgda$Viz$Gui$vizHtmlWindow,
			model.selectedAddress,
			A2(
				$elm$core$Result$andThen,
				A2(
					$elm$core$Basics$composeR,
					$author$project$MicroAgda$File$defByName(model.showName),
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Result$fromMaybe('def not found'),
						$elm$core$Result$map(
							$author$project$ResultExtra$pairR(model.cachedWinWork)))),
				A2($elm$core$Result$fromMaybe, 'no file', model.file))));
};
var $author$project$Main$fileSelector = function (model) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_Nil,
		A2(
			$elm$core$List$map,
			function (fname) {
				var isNow = A2(
					$elm$core$Maybe$withDefault,
					false,
					A2(
						$elm$core$Maybe$map,
						function (f) {
							return _Utils_eq(
								$author$project$MicroAgda$File$getFileName(f),
								fname);
						},
						model.file));
				var s = isNow ? _List_fromArray(
					[
						$rtfeldman$elm_css$Css$textDecoration($rtfeldman$elm_css$Css$underline)
					]) : _List_Nil;
				return A2(
					$rtfeldman$elm_css$Html$Styled$div,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$css(
							A2(
								$elm$core$List$append,
								_List_fromArray(
									[
										$rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$inlineBlock),
										$rtfeldman$elm_css$Css$margin(
										$rtfeldman$elm_css$Css$px(3)),
										$rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer)
									]),
								s)),
							$rtfeldman$elm_css$Html$Styled$Events$onClick(
							$author$project$Main$ReadFile(fname))
						]),
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text(fname)
						]));
			},
			$elm$core$Dict$keys($author$project$MicroAgda$SampleFiles$sampleFiles)));
};
var $author$project$Main$emptyFileView = A2(
	$rtfeldman$elm_css$Html$Styled$div,
	_List_Nil,
	_List_fromArray(
		[
			$rtfeldman$elm_css$Html$Styled$text('nothing is loaded')
		]));
var $rtfeldman$elm_css$Css$rgba = F4(
	function (r, g, b, alpha) {
		return {
			alpha: alpha,
			blue: b,
			color: $rtfeldman$elm_css$Css$Structure$Compatible,
			green: g,
			red: r,
			value: A2(
				$rtfeldman$elm_css$Css$cssFunction,
				'rgba',
				_Utils_ap(
					A2(
						$elm$core$List$map,
						$elm$core$String$fromInt,
						_List_fromArray(
							[r, g, b])),
					_List_fromArray(
						[
							$elm$core$String$fromFloat(alpha)
						])))
		};
	});
var $author$project$Gui$Code$gray = function (x) {
	return A4($rtfeldman$elm_css$Css$rgba, x, x, x, 255);
};
var $author$project$Gui$Code$black = $author$project$Gui$Code$gray(0);
var $author$project$Gui$Code$codeIconSize = 256;
var $author$project$Gui$Code$codeCss = _List_fromArray(
	[
		$rtfeldman$elm_css$Css$fontSize(
		$rtfeldman$elm_css$Css$px(12))
	]);
var $author$project$MicroAgda$File$madToUnParsed = A2(
	$author$project$ResultExtra$convergeResult,
	A2(
		$author$project$ResultExtra$convergeResult,
		$author$project$MicroAgda$File$defMap(
			function (_v0) {
				var _v1 = _v0.a;
				var _v2 = _v1.a;
				var a = _v2.a;
				var _v3 = _v1.b;
				var b = _v3.a;
				var c = _v0.b;
				var d = _v0.c;
				return _Utils_Tuple3(
					_Utils_Tuple2(a, b),
					c,
					d);
			}),
		$author$project$MicroAgda$File$defMap(
			function (_v4) {
				var _v5 = _v4.a;
				var _v6 = _v5.a;
				var a = _v6.a;
				var _v7 = _v5.b;
				var b = _v7.a;
				var c = _v4.b;
				var _v8 = _v4.c;
				var d = _v8.b;
				return _Utils_Tuple3(
					_Utils_Tuple2(a, b),
					c,
					d);
			})),
	$author$project$MicroAgda$File$defMap(
		function (_v9) {
			var _v10 = _v9.a;
			var _v11 = _v10.a;
			var a = _v11.a;
			var _v12 = _v10.b;
			var b = _v12.a;
			var c = _v9.b;
			var _v13 = _v9.c;
			var d = _v13.b;
			return _Utils_Tuple3(
				_Utils_Tuple2(a, b),
				c,
				d);
		}));
var $author$project$MicroAgda$File$getBody = function (_v0) {
	var tcd = _v0.a;
	return tcd.body;
};
var $author$project$MicroAgda$File$getSignature = function (_v0) {
	var tcd = _v0.a;
	return tcd.signature;
};
var $author$project$MicroAgda$File$unParseDef = function (def) {
	return $author$project$MicroAgda$File$getName(def) + (' : ' + ($author$project$MicroAgda$File$getSignature(def) + ('\n' + ($author$project$MicroAgda$File$getName(def) + (' ' + (A2(
		$elm$core$String$join,
		' ',
		$author$project$MicroAgda$File$getArgs(def)) + (' = \n' + A2(
		$author$project$MicroAgda$StringTools$indent,
		2,
		$author$project$MicroAgda$File$getBody(def)))))))));
};
var $author$project$Gui$Code$def2HeadCode = function (x) {
	return A3(
		$rtfeldman$elm_css$Html$Styled$node,
		'pre',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$css($author$project$Gui$Code$codeCss)
			]),
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$text(
				$author$project$MicroAgda$File$unParseDef(
					$author$project$MicroAgda$File$madToUnParsed(x)))
			]));
};
var $rtfeldman$elm_css$Css$color = function (c) {
	return A2($rtfeldman$elm_css$Css$property, 'color', c.value);
};
var $author$project$Gui$Code$lookupDef = F3(
	function (d, i, xs) {
		lookupDef:
		while (true) {
			if (!xs.b) {
				return d;
			} else {
				var x = xs.a;
				var xxs = xs.b;
				if (i < 1) {
					return x;
				} else {
					var $temp$d = d,
						$temp$i = i - 1,
						$temp$xs = xxs;
					d = $temp$d;
					i = $temp$i;
					xs = $temp$xs;
					continue lookupDef;
				}
			}
		}
	});
var $author$project$Gui$Code$getLine = F2(
	function (i, s) {
		var lines = A2($elm$core$String$split, '\n', s);
		return A3($author$project$Gui$Code$lookupDef, '', i, lines);
	});
var $rtfeldman$elm_css$Css$marginTop = $rtfeldman$elm_css$Css$prop1('margin-top');
var $author$project$Gui$Code$red = A3($rtfeldman$elm_css$Css$rgb, 128, 0, 0);
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $author$project$Gui$Code$deadEnd2Html = F2(
	function (code, de) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$css(
					A2(
						$elm$core$List$cons,
						A3(
							$rtfeldman$elm_css$Css$border3,
							$rtfeldman$elm_css$Css$px(2),
							$rtfeldman$elm_css$Css$solid,
							$author$project$Gui$Code$red),
						_List_Nil))
				]),
			_List_fromArray(
				[
					A3(
					$rtfeldman$elm_css$Html$Styled$node,
					'pre',
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$css(_List_Nil)
						]),
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text(
							A2($author$project$Gui$Code$getLine, de.row - 1, code))
						])),
					A3(
					$rtfeldman$elm_css$Html$Styled$node,
					'pre',
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$css(
							_List_fromArray(
								[
									$rtfeldman$elm_css$Css$marginTop(
									$rtfeldman$elm_css$Css$px(-13)),
									$rtfeldman$elm_css$Css$color($author$project$Gui$Code$red)
								]))
						]),
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text(
							A2($elm$core$String$repeat, de.col - 1, ' ') + '◣')
						]))
				]));
	});
var $author$project$Gui$Code$errBox = A2(
	$author$project$ResultExtra$convergeResult,
	function (_v0) {
		var code = _v0.a;
		var el = _v0.b;
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_Nil,
			A2(
				$elm$core$List$map,
				$author$project$Gui$Code$deadEnd2Html(code),
				el));
	},
	function (estr) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_Nil,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$text(estr)
				]));
	});
var $author$project$MicroAgda$File$parseErrorDefinitionExtractErr = function (def) {
	return A3(
		$author$project$ResultExtra$convergeResult,
		function (x) {
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(
					$author$project$MicroAgda$File$getSignature(def).a,
					x));
		},
		function (_v0) {
			return A3(
				$author$project$ResultExtra$convergeResult,
				function (x) {
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(
							$author$project$MicroAgda$File$getBody(def).a,
							x));
				},
				function (_v1) {
					return $elm$core$Maybe$Nothing;
				},
				$author$project$MicroAgda$File$getBody(def).b);
		},
		$author$project$MicroAgda$File$getSignature(def).b);
};
var $author$project$MicroAgda$File$tcErrorDefinitionExtractErr = function (def) {
	var _v0 = _Utils_Tuple2(
		$author$project$MicroAgda$File$getSignature(def),
		$author$project$MicroAgda$File$getBody(def));
	if ((_v0.a.c.$ === 'Just') && (_v0.a.c.a.$ === 'Err')) {
		var _v1 = _v0.a;
		var e = _v1.c.a.a;
		return $elm$core$Maybe$Just(e);
	} else {
		if ((_v0.b.c.$ === 'Just') && (_v0.b.c.a.$ === 'Err')) {
			var _v2 = _v0.b;
			var e = _v2.c.a.a;
			return $elm$core$Maybe$Just(e);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	}
};
var $author$project$MicroAgda$File$extractErr = A2(
	$author$project$ResultExtra$convergeResult,
	A2(
		$author$project$ResultExtra$convergeResult,
		A2(
			$elm$core$Basics$composeR,
			$author$project$MicroAgda$File$parseErrorDefinitionExtractErr,
			$elm$core$Maybe$map($elm$core$Result$Err)),
		A2(
			$elm$core$Basics$composeR,
			$author$project$MicroAgda$File$tcErrorDefinitionExtractErr,
			$elm$core$Maybe$map($elm$core$Result$Ok))),
	function (_v0) {
		return $elm$core$Maybe$Nothing;
	});
var $author$project$MicroAgda$File$getTail = function (_v0) {
	var tcd = _v0.a;
	return tcd.sub;
};
var $author$project$MicroAgda$File$getMADTail = A2(
	$author$project$ResultExtra$convergeResult,
	A2(
		$author$project$ResultExtra$convergeResult,
		A2(
			$elm$core$Basics$composeR,
			$author$project$MicroAgda$File$getTail,
			$elm$core$List$map(
				A2($elm$core$Basics$composeR, $elm$core$Result$Err, $elm$core$Result$Err))),
		A2(
			$elm$core$Basics$composeR,
			$author$project$MicroAgda$File$getTail,
			$elm$core$List$map(
				A2($elm$core$Basics$composeR, $elm$core$Result$Ok, $elm$core$Result$Err)))),
	A2(
		$elm$core$Basics$composeR,
		$author$project$MicroAgda$File$getTail,
		$elm$core$List$map($elm$core$Result$Ok)));
var $rtfeldman$elm_css$Css$marginLeft = $rtfeldman$elm_css$Css$prop1('margin-left');
var $author$project$MicroAgda$File$maybeDef = A2(
	$elm$core$Basics$composeR,
	$elm$core$Result$toMaybe,
	$elm$core$Maybe$map(
		function (def) {
			return _Utils_Tuple2(
				$author$project$MicroAgda$File$getSignatureCT(def),
				$author$project$MicroAgda$File$getBodyTm(def));
		}));
var $rtfeldman$elm_css$Css$minHeight = $rtfeldman$elm_css$Css$prop1('min-height');
var $rtfeldman$elm_css$Css$PercentageUnits = {$: 'PercentageUnits'};
var $rtfeldman$elm_css$Css$pct = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, $rtfeldman$elm_css$Css$PercentageUnits, '%');
var $author$project$Gui$Code$simpleDef2Html = F3(
	function (f2hs, iconF, def) {
		var h0 = A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$relative),
							$rtfeldman$elm_css$Css$backgroundColor(
							$author$project$Gui$Code$gray(240)),
							$rtfeldman$elm_css$Css$marginTop(
							$rtfeldman$elm_css$Css$px(3))
						]))
				]),
			_List_fromArray(
				[
					$author$project$Gui$Code$def2HeadCode(def)
				]));
		var h = A2(
			$elm$core$Result$withDefault,
			_List_Nil,
			A2(
				$elm$core$Result$map,
				function (tcd) {
					return A2(
						$elm$core$Maybe$withDefault,
						_List_Nil,
						A2(
							$elm$core$Maybe$map,
							function (icon) {
								return _List_fromArray(
									[
										A2(
										$rtfeldman$elm_css$Html$Styled$div,
										_List_fromArray(
											[
												$rtfeldman$elm_css$Html$Styled$Attributes$css(
												_List_fromArray(
													[
														$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$relative),
														$rtfeldman$elm_css$Css$minHeight(
														$rtfeldman$elm_css$Css$px($author$project$Gui$Code$codeIconSize)),
														$rtfeldman$elm_css$Css$backgroundColor(
														$author$project$Gui$Code$gray(240))
													]))
											]),
										_List_fromArray(
											[
												A2(
												$rtfeldman$elm_css$Html$Styled$div,
												_List_fromArray(
													[
														$rtfeldman$elm_css$Html$Styled$Events$onClick(
														f2hs.onIconClick(
															$author$project$MicroAgda$File$getName(tcd))),
														$rtfeldman$elm_css$Html$Styled$Attributes$css(
														_List_fromArray(
															[
																$rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer),
																$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$absolute),
																$rtfeldman$elm_css$Css$top(
																$rtfeldman$elm_css$Css$px(0)),
																$rtfeldman$elm_css$Css$left(
																$rtfeldman$elm_css$Css$px(0))
															]))
													]),
												icon),
												A2(
												$rtfeldman$elm_css$Html$Styled$div,
												_List_fromArray(
													[
														$rtfeldman$elm_css$Html$Styled$Attributes$css(
														_List_fromArray(
															[
																$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$relative),
																$rtfeldman$elm_css$Css$left(
																$rtfeldman$elm_css$Css$px($author$project$Gui$Code$codeIconSize + 15)),
																$rtfeldman$elm_css$Css$top(
																$rtfeldman$elm_css$Css$px(0)),
																$rtfeldman$elm_css$Css$width(
																$rtfeldman$elm_css$Css$pct(75))
															]))
													]),
												_List_fromArray(
													[h0]))
											]))
									]);
							},
							A2(
								$elm$core$Maybe$andThen,
								iconF($author$project$Gui$Code$codeIconSize),
								$author$project$MicroAgda$File$maybeDef(def))));
				},
				def));
		var tl = A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$marginLeft(
							$rtfeldman$elm_css$Css$px(20))
						]))
				]),
			A2(
				$elm$core$List$map,
				A2($author$project$Gui$Code$simpleDef2Html, f2hs, iconF),
				$author$project$MicroAgda$File$getMADTail(def)));
		return A2(
			$elm$core$Maybe$withDefault,
			A2(
				$rtfeldman$elm_css$Html$Styled$div,
				_List_Nil,
				A2(
					$elm$core$List$append,
					h,
					_List_fromArray(
						[tl]))),
			A2(
				$elm$core$Maybe$map,
				function (e) {
					return A2(
						$rtfeldman$elm_css$Html$Styled$div,
						_List_Nil,
						A2(
							$elm$core$List$append,
							h,
							_List_fromArray(
								[
									$author$project$Gui$Code$errBox(e),
									tl
								])));
				},
				$author$project$MicroAgda$File$extractErr(def)));
	});
var $author$project$Gui$Code$file2Html = F3(
	function (iconF, f2hs, _v0) {
		var name = _v0.a;
		var l = _v0.b;
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							A3(
							$rtfeldman$elm_css$Css$border3,
							$rtfeldman$elm_css$Css$px(1),
							$rtfeldman$elm_css$Css$solid,
							$author$project$Gui$Code$black),
							$rtfeldman$elm_css$Css$paddingLeft(
							$rtfeldman$elm_css$Css$px(30))
						]))
				]),
			A2(
				$elm$core$List$map,
				A2($author$project$Gui$Code$simpleDef2Html, f2hs, iconF),
				l));
	});
var $author$project$MicroAgda$Viz$Gui$vizSmallPrev = function (vizPrevIconSize) {
	var vizPrevS = _Utils_update(
		$author$project$Gui$Draw$defCanvSet,
		{height: vizPrevIconSize, width: vizPrevIconSize});
	return A2(
		$elm$core$Basics$composeR,
		function (_v0) {
			var ct = _v0.a;
			var tm = _v0.b;
			return A2(
				$elm$core$Result$andThen,
				function (_v1) {
					var dc = _v1.a;
					var n = _v1.b;
					var _v2 = _v1.c;
					var drw0 = _v2.b;
					return A4($author$project$MicroAgda$Viz$Gui$handleDifrentDims, _List_Nil, vizPrevS, n, drw0);
				},
				$author$project$MicroAgda$Viz$Process$allWork(
					_Utils_Tuple2(ct, tm)));
		},
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Result$map($elm$core$List$singleton),
			$elm$core$Result$toMaybe));
};
var $author$project$Main$fileView = function (file) {
	return A2(
		$elm$core$Maybe$withDefault,
		$author$project$Main$emptyFileView,
		A2(
			$elm$core$Maybe$map,
			A2(
				$author$project$Gui$Code$file2Html,
				$author$project$MicroAgda$Viz$Gui$vizSmallPrev,
				{onIconClick: $author$project$Main$ShowDiagram}),
			file));
};
var $author$project$Main$ExitFullScreen = {$: 'ExitFullScreen'};
var $rtfeldman$elm_css$Css$dotted = {borderStyle: $rtfeldman$elm_css$Css$Structure$Compatible, textDecorationStyle: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'dotted'};
var $rtfeldman$elm_css$Css$none = {backgroundImage: $rtfeldman$elm_css$Css$Structure$Compatible, blockAxisOverflow: $rtfeldman$elm_css$Css$Structure$Compatible, borderStyle: $rtfeldman$elm_css$Css$Structure$Compatible, cursor: $rtfeldman$elm_css$Css$Structure$Compatible, display: $rtfeldman$elm_css$Css$Structure$Compatible, hoverCapability: $rtfeldman$elm_css$Css$Structure$Compatible, inlineAxisOverflow: $rtfeldman$elm_css$Css$Structure$Compatible, keyframes: $rtfeldman$elm_css$Css$Structure$Compatible, lengthOrNone: $rtfeldman$elm_css$Css$Structure$Compatible, lengthOrNoneOrMinMaxDimension: $rtfeldman$elm_css$Css$Structure$Compatible, lengthOrNumberOrAutoOrNoneOrContent: $rtfeldman$elm_css$Css$Structure$Compatible, listStyleType: $rtfeldman$elm_css$Css$Structure$Compatible, listStyleTypeOrPositionOrImage: $rtfeldman$elm_css$Css$Structure$Compatible, none: $rtfeldman$elm_css$Css$Structure$Compatible, outline: $rtfeldman$elm_css$Css$Structure$Compatible, pointerDevice: $rtfeldman$elm_css$Css$Structure$Compatible, pointerEvents: $rtfeldman$elm_css$Css$Structure$Compatible, resize: $rtfeldman$elm_css$Css$Structure$Compatible, scriptingSupport: $rtfeldman$elm_css$Css$Structure$Compatible, textDecorationLine: $rtfeldman$elm_css$Css$Structure$Compatible, textTransform: $rtfeldman$elm_css$Css$Structure$Compatible, touchAction: $rtfeldman$elm_css$Css$Structure$Compatible, transform: $rtfeldman$elm_css$Css$Structure$Compatible, updateFrequency: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'none'};
var $rtfeldman$elm_css$Css$right = $rtfeldman$elm_css$Css$prop1('right');
var $author$project$Main$fullScreenView = F3(
	function (model, appHtml, winHtml) {
		var exitBtn = A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$fixed),
							$rtfeldman$elm_css$Css$zIndex(
							$rtfeldman$elm_css$Css$int(2000)),
							$rtfeldman$elm_css$Css$top(
							$rtfeldman$elm_css$Css$px(5)),
							$rtfeldman$elm_css$Css$right(
							$rtfeldman$elm_css$Css$px(5)),
							$rtfeldman$elm_css$Css$height(
							$rtfeldman$elm_css$Css$px(20)),
							$rtfeldman$elm_css$Css$padding(
							$rtfeldman$elm_css$Css$px(5)),
							$rtfeldman$elm_css$Css$fontSize(
							$rtfeldman$elm_css$Css$px(16)),
							$rtfeldman$elm_css$Css$backgroundColor(
							A3($rtfeldman$elm_css$Css$rgb, 255, 255, 255)),
							$rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer),
							A3(
							$rtfeldman$elm_css$Css$border3,
							$rtfeldman$elm_css$Css$px(1),
							$rtfeldman$elm_css$Css$dotted,
							A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0))
						])),
					$rtfeldman$elm_css$Html$Styled$Events$onClick($author$project$Main$ExitFullScreen)
				]),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$text('↩ back to file')
				]));
		var wHtml = model.fullScreenMode ? _List_fromArray(
			[winHtml, exitBtn]) : _List_Nil;
		var appCss = model.fullScreenMode ? _List_fromArray(
			[
				$rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$none)
			]) : _List_Nil;
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_Nil,
			_Utils_ap(
				_List_fromArray(
					[
						A2(
						$rtfeldman$elm_css$Html$Styled$div,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Html$Styled$Attributes$css(appCss)
							]),
						_List_fromArray(
							[appHtml]))
					]),
				wHtml));
	});
var $author$project$Main$view = function (model) {
	return A3(
		$author$project$Main$fullScreenView,
		model,
		A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_Nil,
			_List_fromArray(
				[
					$author$project$Main$fileSelector(model),
					$author$project$Main$defSelector(model),
					A2($rtfeldman$elm_css$Html$Styled$Lazy$lazy, $author$project$Main$fileView, model.file),
					$author$project$Main$consoleView(model)
				])),
		$author$project$Main$drawnHtmlWindow(model));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{
		init: $author$project$Main$init,
		subscriptions: $author$project$Main$subscriptions,
		update: $author$project$Main$update,
		view: A2($elm$core$Basics$composeR, $author$project$Main$view, $rtfeldman$elm_css$Html$Styled$toUnstyled)
	});
_Platform_export({'Main':{'init':$author$project$Main$main($elm$json$Json$Decode$string)(0)}});}(this));