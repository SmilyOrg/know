(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { };
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Theme = function() { };
Theme.__name__ = ["Theme"];
var Know = function() {
	this.ksi = new qa.Ksi();
	this.input = new js.JQuery("#input");
	this.input.bind("input",$bind(this,this.inputChange));
	this.info = new js.JQuery("#info");
	this.outputQuestion = new js.JQuery("#question");
	this.outputAnswer = new js.JQuery("#answer");
	this.debug = new js.JQuery("#debug");
	this.input.val("0xA+1+(-2/3)^4/5");
	this.inputChange();
	var runner = new haxe.unit.TestRunner();
	runner.add(new test.Test());
	runner.run();
	var tests = new js.JQuery("#tests");
	tests.text("" + Std.string(runner.result));
	this.setColor(tests,runner.result.success?Theme.disabled:Theme.error);
};
Know.__name__ = ["Know"];
Know.main = function() {
	new Know();
};
Know.prototype = {
	ksi: null
	,input: null
	,info: null
	,outputQuestion: null
	,outputAnswer: null
	,debug: null
	,inputChange: function(e) {
		var question = this.input.val();
		this.info.text("");
		this.setColor(this.outputQuestion,Theme.disabled);
		this.setColor(this.outputAnswer,Theme.disabled);
		if(question.length == 0) {
			this.outputQuestion.text("");
			this.outputAnswer.text("");
			return;
		}
		try {
			var answer = this.ksi.answer(question);
			this.outputQuestion.html(answer.question);
			this.outputAnswer.html(answer.answer);
			this.debug.html(answer.debug);
			this.setColor(this.outputQuestion,Theme.normal);
			this.setColor(this.outputAnswer,Theme.normal);
			this.typeset(this.outputQuestion[0]);
			this.typeset(this.outputAnswer[0]);
			this.typeset(new js.JQuery(".steps .eval")[0]);
		} catch( e1 ) {
			this.info.text("Error: " + Std.string(e1));
		}
	}
	,typeset: function(element) {
		MathJax.Hub.Queue(['Typeset',MathJax.Hub,element]);;
	}
	,setColor: function(e,color) {
		e.css({ color : "#" + StringTools.hex(color,6)});
	}
	,__class__: Know
};
var List = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	h: null
	,q: null
	,length: null
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else if(sep == null) s.b += "null"; else s.b += "" + sep;
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,__class__: List
};
var IMap = function() { };
IMap.__name__ = ["IMap"];
Math.__name__ = ["Math"];
var Reflect = function() { };
Reflect.__name__ = ["Reflect"];
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
var Std = function() { };
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	b: null
	,__class__: StringBuf
};
var StringTools = function() { };
StringTools.__name__ = ["StringTools"];
StringTools.htmlEscape = function(s,quotes) {
	s = s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
	if(quotes) return s.split("\"").join("&quot;").split("'").join("&#039;"); else return s;
};
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
};
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
};
var Type = function() { };
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
};
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
};
var byte = {};
byte._LittleEndianReader = {};
byte._LittleEndianReader.LittleEndianReader_Impl_ = function() { };
byte._LittleEndianReader.LittleEndianReader_Impl_.__name__ = ["byte","_LittleEndianReader","LittleEndianReader_Impl_"];
byte._LittleEndianReader.LittleEndianReader_Impl_._new = function(data) {
	return data;
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readInt8 = function(this1,pos) {
	var n = this1[pos];
	if(n >= 128) return n - 256;
	return n;
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readUInt8 = function(this1,pos) {
	return this1[pos];
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readInt16 = function(this1,pos) {
	var ch1 = this1[pos];
	var ch2 = this1[pos + 1];
	var n = ch1 | ch2 << 8;
	if((n & 32768) != 0) return n - 65536;
	return n;
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readUInt16 = function(this1,pos) {
	var ch1 = this1[pos];
	var ch2 = this1[pos + 1];
	return ch1 | ch2 << 8;
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readInt24 = function(this1,pos) {
	var ch1 = this1[pos];
	var ch2 = this1[pos + 1];
	var ch3 = this1[pos + 2];
	var n = ch1 | ch2 << 8 | ch3 << 16;
	if((n & 8388608) != 0) return n - 16777216;
	return n;
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readUInt24 = function(this1,pos) {
	var ch1 = this1[pos];
	var ch2 = this1[pos + 1];
	var ch3 = this1[pos + 2];
	return ch1 | ch2 << 8 | ch3 << 16;
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readInt32 = function(this1,pos) {
	var ch1 = this1[pos];
	var ch2 = this1[pos + 1];
	var ch3 = this1[pos + 2];
	var ch4 = this1[pos + 3];
	return ch1 | ch2 << 8 | ch3 << 16 | ch4 << 24;
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readString = function(this1,pos,len) {
	return byte.js._ByteData.ByteData_Impl_.readString(this1,pos,len);
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readFloat = function(this1,pos) {
	var bytes = [];
	bytes.push(this1[pos]);
	bytes.push(this1[pos + 1]);
	bytes.push(this1[pos + 2]);
	bytes.push(this1[pos + 3]);
	var sign = 1 - (bytes[0] >> 7 << 1);
	var exp = (bytes[0] << 1 & 255 | bytes[1] >> 7) - 127;
	var sig = (bytes[1] & 127) << 16 | bytes[2] << 8 | bytes[3];
	if(sig == 0 && exp == -127) return 0.0;
	return sign * (1 + Math.pow(2,-23) * sig) * Math.pow(2,exp);
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readDouble = function(this1,pos) {
	var bytes = [];
	bytes.push(this1[pos]);
	bytes.push(this1[pos + 1]);
	bytes.push(this1[pos + 2]);
	bytes.push(this1[pos + 3]);
	bytes.push(this1[pos + 4]);
	bytes.push(this1[pos + 5]);
	bytes.push(this1[pos + 6]);
	bytes.push(this1[pos + 7]);
	var sign = 1 - (bytes[0] >> 7 << 1);
	var exp = (bytes[0] << 4 & 2047 | bytes[1] >> 4) - 1023;
	var sig = byte._LittleEndianReader.LittleEndianReader_Impl_.getDoubleSig(this1,bytes);
	if(sig == 0 && exp == -1023) return 0.0;
	return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
};
byte._LittleEndianReader.LittleEndianReader_Impl_.getDoubleSig = function(this1,bytes) {
	return ((bytes[1] & 15) << 16 | bytes[2] << 8 | bytes[3]) * 4294967296. + (bytes[4] >> 7) * 2147483648 + ((bytes[4] & 127) << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7]);
};
byte._LittleEndianWriter = {};
byte._LittleEndianWriter.LittleEndianWriter_Impl_ = function() { };
byte._LittleEndianWriter.LittleEndianWriter_Impl_.__name__ = ["byte","_LittleEndianWriter","LittleEndianWriter_Impl_"];
byte._LittleEndianWriter.LittleEndianWriter_Impl_._new = function(data) {
	return data;
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeInt8 = function(this1,pos,x) {
	if(x < -128 || x >= 128) throw haxe.io.Error.Overflow;
	this1[pos] = x & 255 & 255;
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeUInt8 = function(this1,pos,x) {
	this1[pos] = x & 255;
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeInt16 = function(this1,pos,x) {
	if(x < -32768 || x >= 32768) throw haxe.io.Error.Overflow;
	byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeUInt16(this1,pos,x & 65535);
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeUInt16 = function(this1,pos,x) {
	if(x < 0 || x >= 65536) throw haxe.io.Error.Overflow;
	this1[pos] = x & 255 & 255;
	this1[pos + 1] = x >> 8 & 255;
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeInt24 = function(this1,pos,x) {
	if(x < -8388608 || x >= 8388608) throw haxe.io.Error.Overflow;
	byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeUInt24(this1,pos,x & 16777215);
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeUInt24 = function(this1,pos,x) {
	if(x < 0 || x >= 16777216) throw haxe.io.Error.Overflow;
	this1[pos] = x & 255 & 255;
	this1[pos + 1] = x >> 8 & 255 & 255;
	this1[pos + 2] = x >> 16 & 255;
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeInt32 = function(this1,pos,x) {
	this1[pos] = x & 255 & 255;
	this1[pos + 1] = x >> 8 & 255 & 255;
	this1[pos + 2] = x >> 16 & 255 & 255;
	this1[pos + 3] = x >>> 24 & 255;
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeFloat = function(this1,pos,x) {
	if(x == 0.0) {
		this1[pos] = 0;
		this1[pos + 1] = 0;
		this1[pos + 2] = 0;
		this1[pos + 3] = 0;
		return;
	}
	var exp = Math.floor(Math.log(Math.abs(x)) / byte._LittleEndianWriter.LittleEndianWriter_Impl_.LN2);
	var sig = Math.floor(Math.abs(x) / Math.pow(2,exp) * 8388608) & 8388607;
	var b1;
	b1 = exp + 127 >> 1 | (exp > 0?x < 0?128:64:x < 0?128:0);
	var b2 = exp + 127 << 7 & 255 | sig >> 16 & 127;
	var b3 = sig >> 8 & 255;
	var b4 = sig & 255;
	this1[pos] = b1 & 255;
	this1[pos + 1] = b2 & 255;
	this1[pos + 2] = b3 & 255;
	this1[pos + 3] = b4 & 255;
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeDouble = function(this1,pos,x) {
	if(x == 0.0) {
		this1[pos] = 0;
		this1[pos + 1] = 0;
		this1[pos + 2] = 0;
		this1[pos + 3] = 0;
		this1[pos + 4] = 0;
		this1[pos + 5] = 0;
		this1[pos + 6] = 0;
		this1[pos + 7] = 0;
		return;
	}
	var exp = Math.floor(Math.log(Math.abs(x)) / byte._LittleEndianWriter.LittleEndianWriter_Impl_.LN2);
	var sig = Math.floor(Math.abs(x) / Math.pow(2,exp) * Math.pow(2,52));
	var sig_h = sig & 34359738367;
	var sig_l = Math.floor(sig / Math.pow(2,32));
	var b1;
	b1 = exp + 1023 >> 4 | (exp > 0?x < 0?128:64:x < 0?128:0);
	var b2 = exp + 1023 << 4 & 255 | sig_l >> 16 & 15;
	var b3 = sig_l >> 8 & 255;
	var b4 = sig_l & 255;
	var b5 = sig_h >> 24 & 255;
	var b6 = sig_h >> 16 & 255;
	var b7 = sig_h >> 8 & 255;
	var b8 = sig_h & 255;
	this1[pos] = b1 & 255;
	this1[pos + 1] = b2 & 255;
	this1[pos + 2] = b3 & 255;
	this1[pos + 3] = b4 & 255;
	this1[pos + 4] = b5 & 255;
	this1[pos + 5] = b6 & 255;
	this1[pos + 6] = b7 & 255;
	this1[pos + 7] = b8 & 255;
};
byte.js = {};
byte.js._ByteData = {};
byte.js._ByteData.ByteData_Impl_ = function() { };
byte.js._ByteData.ByteData_Impl_.__name__ = ["byte","js","_ByteData","ByteData_Impl_"];
byte.js._ByteData.ByteData_Impl_.get_length = function(this1) {
	return this1.length;
};
byte.js._ByteData.ByteData_Impl_.get_reader = function(this1) {
	return this1;
};
byte.js._ByteData.ByteData_Impl_.get_writer = function(this1) {
	return this1;
};
byte.js._ByteData.ByteData_Impl_._new = function(data) {
	return data;
};
byte.js._ByteData.ByteData_Impl_.readByte = function(this1,pos) {
	return this1[pos];
};
byte.js._ByteData.ByteData_Impl_.writeByte = function(this1,pos,v) {
	this1[pos] = v & 255;
};
byte.js._ByteData.ByteData_Impl_.readString = function(this1,pos,len) {
	var buf = new StringBuf();
	var _g1 = pos;
	var _g = pos + len;
	while(_g1 < _g) {
		var i = _g1++;
		buf.b += String.fromCharCode(this1[i]);
	}
	return buf.b;
};
byte.js._ByteData.ByteData_Impl_.alloc = function(length) {
	var b = new Uint8Array(length);
	return b;
};
byte.js._ByteData.ByteData_Impl_.ofString = function(s) {
	var a = new Uint8Array(s.length);
	var _g1 = 0;
	var _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = s.charCodeAt(i);
	}
	return a;
};
var haxe = {};
haxe.StackItem = { __ename__ : true, __constructs__ : ["CFunction","Module","FilePos","Method","LocalFunction"] };
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; return $x; };
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; return $x; };
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; return $x; };
haxe.StackItem.LocalFunction = function(v) { var $x = ["LocalFunction",4,v]; $x.__enum__ = haxe.StackItem; return $x; };
haxe.CallStack = function() { };
haxe.CallStack.__name__ = ["haxe","CallStack"];
haxe.CallStack.exceptionStack = function() {
	return [];
};
haxe.CallStack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += "\nCalled from ";
		haxe.CallStack.itemToString(b,s);
	}
	return b.b;
};
haxe.CallStack.itemToString = function(b,s) {
	switch(s[1]) {
	case 0:
		b.b += "a C function";
		break;
	case 1:
		var m = s[2];
		b.b += "module ";
		if(m == null) b.b += "null"; else b.b += "" + m;
		break;
	case 2:
		var line = s[4];
		var file = s[3];
		var s1 = s[2];
		if(s1 != null) {
			haxe.CallStack.itemToString(b,s1);
			b.b += " (";
		}
		if(file == null) b.b += "null"; else b.b += "" + file;
		b.b += " line ";
		if(line == null) b.b += "null"; else b.b += "" + line;
		if(s1 != null) b.b += ")";
		break;
	case 3:
		var meth = s[3];
		var cname = s[2];
		if(cname == null) b.b += "null"; else b.b += "" + cname;
		b.b += ".";
		if(meth == null) b.b += "null"; else b.b += "" + meth;
		break;
	case 4:
		var n = s[2];
		b.b += "local function #";
		if(n == null) b.b += "null"; else b.b += "" + n;
		break;
	}
};
haxe.Log = function() { };
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
};
haxe.ds = {};
haxe.ds.GenericCell = function(elt,next) {
	this.elt = elt;
	this.next = next;
};
haxe.ds.GenericCell.__name__ = ["haxe","ds","GenericCell"];
haxe.ds.GenericCell.prototype = {
	elt: null
	,next: null
	,__class__: haxe.ds.GenericCell
};
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = ["haxe","ds","StringMap"];
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	h: null
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,__class__: haxe.ds.StringMap
};
haxe.io = {};
haxe.io.Eof = function() {
};
haxe.io.Eof.__name__ = ["haxe","io","Eof"];
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
};
haxe.io.Error = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; return $x; };
haxe.unit = {};
haxe.unit.TestCase = function() {
};
haxe.unit.TestCase.__name__ = ["haxe","unit","TestCase"];
haxe.unit.TestCase.prototype = {
	currentTest: null
	,setup: function() {
	}
	,tearDown: function() {
	}
	,print: function(v) {
		haxe.unit.TestRunner.print(v);
	}
	,assertTrue: function(b,c) {
		this.currentTest.done = true;
		if(b == false) {
			this.currentTest.success = false;
			this.currentTest.error = "expected true but was false";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,assertFalse: function(b,c) {
		this.currentTest.done = true;
		if(b == true) {
			this.currentTest.success = false;
			this.currentTest.error = "expected false but was true";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,assertEquals: function(expected,actual,c) {
		this.currentTest.done = true;
		if(actual != expected) {
			this.currentTest.success = false;
			this.currentTest.error = "expected '" + Std.string(expected) + "' but was '" + Std.string(actual) + "'";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,__class__: haxe.unit.TestCase
};
haxe.unit.TestResult = function() {
	this.m_tests = new List();
	this.success = true;
};
haxe.unit.TestResult.__name__ = ["haxe","unit","TestResult"];
haxe.unit.TestResult.prototype = {
	m_tests: null
	,success: null
	,add: function(t) {
		this.m_tests.add(t);
		if(!t.success) this.success = false;
	}
	,toString: function() {
		var buf = new StringBuf();
		var failures = 0;
		var $it0 = this.m_tests.iterator();
		while( $it0.hasNext() ) {
			var test = $it0.next();
			if(test.success == false) {
				buf.b += "* ";
				if(test.classname == null) buf.b += "null"; else buf.b += "" + test.classname;
				buf.b += "::";
				if(test.method == null) buf.b += "null"; else buf.b += "" + test.method;
				buf.b += "()";
				buf.b += "\n";
				buf.b += "ERR: ";
				if(test.posInfos != null) {
					buf.b += Std.string(test.posInfos.fileName);
					buf.b += ":";
					buf.b += Std.string(test.posInfos.lineNumber);
					buf.b += "(";
					buf.b += Std.string(test.posInfos.className);
					buf.b += ".";
					buf.b += Std.string(test.posInfos.methodName);
					buf.b += ") - ";
				}
				if(test.error == null) buf.b += "null"; else buf.b += "" + test.error;
				buf.b += "\n";
				if(test.backtrace != null) {
					if(test.backtrace == null) buf.b += "null"; else buf.b += "" + test.backtrace;
					buf.b += "\n";
				}
				buf.b += "\n";
				failures++;
			}
		}
		buf.b += "\n";
		if(failures == 0) buf.b += "OK "; else buf.b += "FAILED ";
		buf.b += Std.string(this.m_tests.length);
		buf.b += " tests, ";
		if(failures == null) buf.b += "null"; else buf.b += "" + failures;
		buf.b += " failed, ";
		buf.b += Std.string(this.m_tests.length - failures);
		buf.b += " success";
		buf.b += "\n";
		return buf.b;
	}
	,__class__: haxe.unit.TestResult
};
haxe.unit.TestRunner = function() {
	this.result = new haxe.unit.TestResult();
	this.cases = new List();
};
haxe.unit.TestRunner.__name__ = ["haxe","unit","TestRunner"];
haxe.unit.TestRunner.print = function(v) {
	var msg = js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) {
		msg = msg.split("\n").join("<br/>");
		d.innerHTML += StringTools.htmlEscape(msg) + "<br/>";
	} else if(typeof process != "undefined" && process.stdout != null && process.stdout.write != null) process.stdout.write(msg); else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
haxe.unit.TestRunner.customTrace = function(v,p) {
	haxe.unit.TestRunner.print(p.fileName + ":" + p.lineNumber + ": " + Std.string(v) + "\n");
};
haxe.unit.TestRunner.prototype = {
	result: null
	,cases: null
	,add: function(c) {
		this.cases.add(c);
	}
	,run: function() {
		this.result = new haxe.unit.TestResult();
		var $it0 = this.cases.iterator();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			this.runCase(c);
		}
		haxe.unit.TestRunner.print(this.result.toString());
		return this.result.success;
	}
	,runCase: function(t) {
		var old = haxe.Log.trace;
		haxe.Log.trace = haxe.unit.TestRunner.customTrace;
		var cl = Type.getClass(t);
		var fields = Type.getInstanceFields(cl);
		haxe.unit.TestRunner.print("Class: " + Type.getClassName(cl) + " ");
		var _g = 0;
		while(_g < fields.length) {
			var f = fields[_g];
			++_g;
			var fname = f;
			var field = Reflect.field(t,f);
			if(StringTools.startsWith(fname,"test") && Reflect.isFunction(field)) {
				t.currentTest = new haxe.unit.TestStatus();
				t.currentTest.classname = Type.getClassName(cl);
				t.currentTest.method = fname;
				t.setup();
				try {
					Reflect.callMethod(t,field,new Array());
					if(t.currentTest.done) {
						t.currentTest.success = true;
						haxe.unit.TestRunner.print(".");
					} else {
						t.currentTest.success = false;
						t.currentTest.error = "(warning) no assert";
						haxe.unit.TestRunner.print("W");
					}
				} catch( $e0 ) {
					if( js.Boot.__instanceof($e0,haxe.unit.TestStatus) ) {
						var e = $e0;
						haxe.unit.TestRunner.print("F");
						t.currentTest.backtrace = haxe.CallStack.toString(haxe.CallStack.exceptionStack());
					} else {
					var e1 = $e0;
					haxe.unit.TestRunner.print("E");
					if(e1.message != null) t.currentTest.error = "exception thrown : " + Std.string(e1) + " [" + Std.string(e1.message) + "]"; else t.currentTest.error = "exception thrown : " + Std.string(e1);
					t.currentTest.backtrace = haxe.CallStack.toString(haxe.CallStack.exceptionStack());
					}
				}
				this.result.add(t.currentTest);
				t.tearDown();
			}
		}
		haxe.unit.TestRunner.print("\n");
		haxe.Log.trace = old;
	}
	,__class__: haxe.unit.TestRunner
};
haxe.unit.TestStatus = function() {
	this.done = false;
	this.success = false;
};
haxe.unit.TestStatus.__name__ = ["haxe","unit","TestStatus"];
haxe.unit.TestStatus.prototype = {
	done: null
	,success: null
	,error: null
	,method: null
	,classname: null
	,posInfos: null
	,backtrace: null
	,__class__: haxe.unit.TestStatus
};
var hxmath = {};
hxmath._BigInt = {};
hxmath._BigInt.BigInt_Impl_ = function() { };
hxmath._BigInt.BigInt_Impl_.__name__ = ["hxmath","_BigInt","BigInt_Impl_"];
hxmath._BigInt.BigInt_Impl_.get_impl = function(this1) {
	return this1;
};
hxmath._BigInt.BigInt_Impl_._new = function() {
	var this1;
	this1 = { chunks : new Array(), signum : 0};
	return this1;
};
hxmath._BigInt.BigInt_Impl_.alloc = function() {
	return { chunks : new Array(), signum : 0};
};
hxmath._BigInt.BigInt_Impl_.ofInt = function(n) {
	var bn;
	var this1;
	this1 = { chunks : new Array(), signum : 0};
	bn = this1;
	if(n < 0) {
		bn.signum = -1;
		n = -n;
	} else if(n > 0) bn.signum = 1; else return bn;
	while(n != 0) {
		bn.chunks.push(n & 1073741823);
		n >>>= 30;
	}
	return bn;
};
hxmath._BigInt.BigInt_Impl_.ofFloat = function(n) {
	var bn;
	var this1;
	this1 = { chunks : new Array(), signum : 0};
	bn = this1;
	if(n < 0) {
		bn.signum = -1;
		n = -n;
	} else if(n > 0) bn.signum = 1;
	n = Math.floor(n);
	while(n != 0) {
		bn.chunks.push(n % 1073741824. | 0);
		n = Math.floor(n / 1073741824.);
	}
	return bn;
};
hxmath._BigInt.BigInt_Impl_.ofString = function(n) {
	var this1;
	this1 = { chunks : new Array(), signum : 0};
	return this1;
};
hxmath._BigInt.BigInt_Impl_.toInt = function(this1) {
	var n = 0;
	var i = this1.chunks.length - 1;
	while(i >= 0) {
		n <<= 30;
		n |= this1.chunks[i];
		i--;
	}
	return n * this1.signum;
};
hxmath._BigInt.BigInt_Impl_.toFloat = function(this1) {
	var n = 0.0;
	var i = this1.chunks.length - 1;
	while(i >= 0) {
		n *= 1073741824.;
		n += this1.chunks[i];
		i--;
	}
	return n * this1.signum;
};
hxmath._BigInt.BigInt_Impl_.toString = function(this1) {
	return "0";
};
hxmath._BigInt.BigInt_Impl_.eq = function(lhs,rhs) {
	if(lhs.signum != rhs.signum) return false;
	if(lhs.chunks.length != rhs.chunks.length) return false;
	var _g1 = 0;
	var _g = lhs.chunks.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(lhs.chunks[i] != rhs.chunks[i]) return false;
	}
	return true;
};
hxmath._BigInt.BigInt_Impl_.neq = function(lhs,rhs) {
	return !hxmath._BigInt.BigInt_Impl_.eq(lhs,rhs);
};
hxmath._BigInt.BigInt_Impl_.eqInt = function(lhs,rhs) {
	return hxmath._BigInt.BigInt_Impl_.eq(lhs,hxmath._BigInt.BigInt_Impl_.ofInt(rhs));
};
hxmath._BigInt.BigInt_Impl_.neqInt = function(lhs,rhs) {
	var rhs1 = hxmath._BigInt.BigInt_Impl_.ofInt(rhs);
	return !hxmath._BigInt.BigInt_Impl_.eq(lhs,rhs1);
};
hxmath._BigInt.BigInt_Impl_.add = function(lhs,rhs) {
	if(lhs.signum == 0) return rhs;
	if(rhs.signum == 0) return lhs;
	if(hxmath._BigInt.BigInt_Impl_._compareMagnitude(lhs,rhs) == 1) {
		var temp = lhs;
		lhs = rhs;
		rhs = temp;
	}
	if(lhs.signum == rhs.signum) return hxmath._BigInt.BigInt_Impl_._add(lhs,rhs); else return hxmath._BigInt.BigInt_Impl_._sub(lhs,rhs);
};
hxmath._BigInt.BigInt_Impl_.sub = function(lhs,rhs) {
	var this1;
	this1 = { chunks : new Array(), signum : 0};
	return this1;
};
hxmath._BigInt.BigInt_Impl_._compareMagnitude = function(a,b) {
	if(a.chunks.length > b.chunks.length) return -1;
	if(a.chunks.length < b.chunks.length) return 1;
	var i = a.chunks.length;
	while(i >= 0) {
		if(a.chunks[i] > b.chunks[i]) return -1;
		if(a.chunks[i] < b.chunks[i]) return 1;
		i--;
	}
	return 0;
};
hxmath._BigInt.BigInt_Impl_._add = function(big,small) {
	var out;
	var this1;
	this1 = { chunks : new Array(), signum : 0};
	out = this1;
	var carry = 0;
	var _g1 = 0;
	var _g = big.chunks.length;
	while(_g1 < _g) {
		var i = _g1++;
		var sum = big.chunks[i] + small.chunks[i] + carry;
		carry = sum >>> 30;
		sum &= 1073741823;
		out.chunks.push(sum);
	}
	var _g11 = big.chunks.length;
	var _g2 = small.chunks.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		var sum1 = big.chunks[i1] + carry;
		carry = sum1 >>> 30;
		sum1 &= 1073741823;
		out.chunks.push(sum1);
	}
	if(carry == 1) out.chunks.push(1);
	out.signum = big.signum;
	return out;
};
hxmath._BigInt.BigInt_Impl_._sub = function(big,small) {
	var out;
	var this1;
	this1 = { chunks : new Array(), signum : 0};
	out = this1;
	var borrow = 0;
	var _g1 = 0;
	var _g = big.chunks.length;
	while(_g1 < _g) {
		var i = _g1++;
		var diff = big.chunks[i] - small.chunks[i] - borrow;
		borrow = diff >>> 30;
		diff &= 1073741823;
		out.chunks.push(diff);
	}
	var _g11 = big.chunks.length;
	var _g2 = small.chunks.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		var diff1 = big.chunks[i1] - borrow;
		borrow = diff1 >>> 30;
		diff1 &= 1073741823;
		out.chunks.push(diff1);
	}
	if(borrow == 1) out.chunks.push(1);
	out.signum = big.signum;
	return out;
};
hxmath._BigInt.BigInt_Impl_.mul2 = function(lhs,rhs) {
	var outChunks = new Array();
	var product;
	var carry = 0;
	var _g1 = 0;
	var _g = lhs.chunks.length + rhs.chunks.length;
	while(_g1 < _g) {
		var i = _g1++;
		outChunks[i] = 0;
	}
	var _g11 = 0;
	var _g2 = rhs.chunks.length;
	while(_g11 < _g2) {
		var j = _g11++;
		var _g3 = 0;
		var _g21 = lhs.chunks.length;
		while(_g3 < _g21) {
			var i1 = _g3++;
			product = outChunks[i1 + j] + lhs.chunks[i1] * rhs.chunks[j] + carry;
			outChunks[i1 + j] = product & 1073741823;
			carry = product >>> 30;
		}
		outChunks[j + lhs.chunks.length] = carry;
	}
	var n;
	var this1;
	this1 = { chunks : new Array(), signum : 0};
	n = this1;
	var i2 = outChunks.length - 1;
	while(i2 >= 0 && outChunks[i2] == 0) i2--;
	n.chunks = outChunks.slice(0,i2 + 1);
	n.signum = lhs.signum * rhs.signum;
	return n;
};
hxmath._BigInt.BigInt_Impl_.mul = function(lhs,rhs) {
	var outChunks = new Array();
	var product;
	var carry = 0;
	var _g1 = 0;
	var _g = lhs.chunks.length + rhs.chunks.length;
	while(_g1 < _g) {
		var i = _g1++;
		outChunks[i] = 0;
	}
	var _g11 = 0;
	var _g2 = rhs.chunks.length;
	while(_g11 < _g2) {
		var j = _g11++;
		var _g3 = 0;
		var _g21 = lhs.chunks.length;
		while(_g3 < _g21) {
			var i1 = _g3++;
			var rLow = rhs.chunks[i1] & 32767;
			var rHigh = rhs.chunks[i1] >>> 15;
			var lLow = lhs.chunks[j] & 32767;
			var lHigh = lhs.chunks[j] >>> 15;
			var p00 = rLow * lLow;
			var p01 = rLow * lHigh;
			var p10 = rHigh * lLow;
			var p11 = rHigh * lHigh;
			haxe.Log.trace("" + rHigh + " " + rLow + "  " + lHigh + " " + lLow,{ fileName : "BigInt.hx", lineNumber : 235, className : "hxmath._BigInt.BigInt_Impl_", methodName : "mul"});
			haxe.Log.trace("" + p00 + " " + p01 + " " + p10 + " " + p11,{ fileName : "BigInt.hx", lineNumber : 236, className : "hxmath._BigInt.BigInt_Impl_", methodName : "mul"});
			var productLow = ((p01 & 32767) << 15) + ((p10 & 32767) << 15) + p00;
			productLow += outChunks[i1 + j] + carry;
			var productHigh = p11 + (p01 >>> 15) + (p10 >>> 15);
			productHigh += productLow >>> 30;
			productLow &= 1073741823;
			outChunks[i1 + j] = productLow;
			carry = productHigh;
		}
		outChunks[j + lhs.chunks.length] = carry;
	}
	var n;
	var this1;
	this1 = { chunks : new Array(), signum : 0};
	n = this1;
	n.chunks = outChunks;
	n.signum = lhs.signum * rhs.signum;
	hxmath._BigInt.BigInt_Impl_.trimLeadingZeroes(n);
	return n;
};
hxmath._BigInt.BigInt_Impl_.div = function(lhs,rhs) {
	var this1;
	this1 = { chunks : new Array(), signum : 0};
	return this1;
};
hxmath._BigInt.BigInt_Impl_.neg = function(n) {
	var out;
	var this1;
	this1 = { chunks : new Array(), signum : 0};
	out = this1;
	out.chunks = n.chunks;
	out.signum = -n.signum;
	return out;
};
hxmath._BigInt.BigInt_Impl_.trimLeadingZeroes = function(this1) {
	while(this1.chunks[this1.chunks.length - 1] == 0) this1.chunks.pop();
};
var hxparse = {};
hxparse.LexEngine = function(patterns) {
	this.nodes = [];
	this.finals = [];
	this.states = [];
	this.hstates = new haxe.ds.StringMap();
	this.uid = 0;
	var pid = 0;
	var _g = 0;
	while(_g < patterns.length) {
		var p = patterns[_g];
		++_g;
		var id = pid++;
		var f = new hxparse._LexEngine.Node(this.uid++,id);
		var n = this.initNode(p,f,id);
		this.nodes.push(n);
		this.finals.push(f);
	}
	this.makeState(this.addNodes([],this.nodes));
};
hxparse.LexEngine.__name__ = ["hxparse","LexEngine"];
hxparse.LexEngine.single = function(c) {
	return [{ min : c, max : c}];
};
hxparse.LexEngine.parse = function(pattern) {
	var p = hxparse.LexEngine.parseInner(byte.js._ByteData.ByteData_Impl_.ofString(pattern));
	if(p == null) throw "Invalid pattern '" + pattern + "'";
	return p.pattern;
};
hxparse.LexEngine.next = function(a,b) {
	if(a == hxparse._LexEngine.Pattern.Empty) return b; else return hxparse._LexEngine.Pattern.Next(a,b);
};
hxparse.LexEngine.plus = function(r) {
	switch(r[1]) {
	case 4:
		var r2 = r[3];
		var r1 = r[2];
		return hxparse._LexEngine.Pattern.Next(r1,hxparse.LexEngine.plus(r2));
	default:
		return hxparse._LexEngine.Pattern.Plus(r);
	}
};
hxparse.LexEngine.star = function(r) {
	switch(r[1]) {
	case 4:
		var r2 = r[3];
		var r1 = r[2];
		return hxparse._LexEngine.Pattern.Next(r1,hxparse.LexEngine.star(r2));
	default:
		return hxparse._LexEngine.Pattern.Star(r);
	}
};
hxparse.LexEngine.opt = function(r) {
	switch(r[1]) {
	case 4:
		var r2 = r[3];
		var r1 = r[2];
		return hxparse._LexEngine.Pattern.Next(r1,hxparse.LexEngine.opt(r2));
	default:
		return hxparse._LexEngine.Pattern.Choice(r,hxparse._LexEngine.Pattern.Empty);
	}
};
hxparse.LexEngine.cinter = function(c1,c2) {
	return hxparse.LexEngine.ccomplement(hxparse.LexEngine.cunion(hxparse.LexEngine.ccomplement(c1),hxparse.LexEngine.ccomplement(c2)));
};
hxparse.LexEngine.cdiff = function(c1,c2) {
	return hxparse.LexEngine.ccomplement(hxparse.LexEngine.cunion(hxparse.LexEngine.ccomplement(c1),c2));
};
hxparse.LexEngine.ccomplement = function(c) {
	var first = c[0];
	var start;
	if(first != null && first.min == -1) start = c.shift().max + 1; else start = -1;
	var out = [];
	var _g = 0;
	while(_g < c.length) {
		var k = c[_g];
		++_g;
		out.push({ min : start, max : k.min - 1});
		start = k.max + 1;
	}
	if(start <= 255) out.push({ min : start, max : 255});
	return out;
};
hxparse.LexEngine.cunion = function(ca,cb) {
	var i = 0;
	var j = 0;
	var out = [];
	var a = ca[i++];
	var b = cb[j++];
	while(true) {
		if(a == null) {
			out.push(b);
			while(j < cb.length) out.push(cb[j++]);
			break;
		}
		if(b == null) {
			out.push(a);
			while(i < ca.length) out.push(ca[i++]);
			break;
		}
		if(a.min <= b.min) {
			if(a.max + 1 < b.min) {
				out.push(a);
				a = ca[i++];
			} else if(a.max < b.max) {
				b = { min : a.min, max : b.max};
				a = ca[i++];
			} else b = cb[j++];
		} else {
			var tmp = ca;
			ca = cb;
			cb = tmp;
			var tmp1 = j;
			j = i;
			i = tmp1;
			var tmp2 = a;
			a = b;
			b = tmp2;
		}
	}
	return out;
};
hxparse.LexEngine.parseInner = function(pattern,i,pDepth) {
	if(pDepth == null) pDepth = 0;
	if(i == null) i = 0;
	var r = hxparse._LexEngine.Pattern.Empty;
	var l = byte.js._ByteData.ByteData_Impl_.get_length(pattern);
	while(i < l) {
		var c;
		var pos = i++;
		c = pattern[pos];
		if(c > 255) throw c;
		switch(c) {
		case 43:
			if(r != hxparse._LexEngine.Pattern.Empty) r = hxparse.LexEngine.plus(r); else r = hxparse.LexEngine.next(r,hxparse._LexEngine.Pattern.Match([{ min : c, max : c}]));
			break;
		case 42:
			if(r != hxparse._LexEngine.Pattern.Empty) r = hxparse.LexEngine.star(r); else r = hxparse.LexEngine.next(r,hxparse._LexEngine.Pattern.Match([{ min : c, max : c}]));
			break;
		case 63:
			if(r != hxparse._LexEngine.Pattern.Empty) r = hxparse.LexEngine.opt(r); else r = hxparse.LexEngine.next(r,hxparse._LexEngine.Pattern.Match([{ min : c, max : c}]));
			break;
		case 124:
			if(r != hxparse._LexEngine.Pattern.Empty) {
				var r2 = hxparse.LexEngine.parseInner(pattern,i);
				return { pattern : hxparse._LexEngine.Pattern.Choice(r,r2.pattern), pos : r2.pos};
			} else r = hxparse.LexEngine.next(r,hxparse._LexEngine.Pattern.Match([{ min : c, max : c}]));
			break;
		case 46:
			r = hxparse.LexEngine.next(r,hxparse._LexEngine.Pattern.Match(hxparse.LexEngine.ALL_CHARS));
			break;
		case 40:
			var r21 = hxparse.LexEngine.parseInner(pattern,i,pDepth + 1);
			i = r21.pos;
			r = hxparse.LexEngine.next(r,r21.pattern);
			break;
		case 41:
			return { pattern : hxparse._LexEngine.Pattern.Group(r), pos : i};
		case 91:
			if(byte.js._ByteData.ByteData_Impl_.get_length(pattern) > 1) {
				var range = 0;
				var acc = [];
				var not = pattern[i] == 94;
				if(not) i++;
				while(true) {
					var c1;
					var pos1 = i++;
					c1 = pattern[pos1];
					if(c1 == 93) {
						if(range != 0) return null;
						break;
					} else if(c1 == 45) {
						if(range != 0) return null;
						var last = acc.pop();
						if(last == null) acc.push({ min : c1, max : c1}); else {
							if(last.min != last.max) return null;
							range = last.min;
						}
					} else {
						if(c1 == 92) {
							var pos2 = i++;
							c1 = pattern[pos2];
						}
						if(range == 0) acc.push({ min : c1, max : c1}); else {
							acc.push({ min : range, max : c1});
							range = 0;
						}
					}
				}
				var g = [];
				var _g = 0;
				while(_g < acc.length) {
					var k = acc[_g];
					++_g;
					g = hxparse.LexEngine.cunion(g,[k]);
				}
				if(not) g = hxparse.LexEngine.cdiff(hxparse.LexEngine.ALL_CHARS,g);
				r = hxparse.LexEngine.next(r,hxparse._LexEngine.Pattern.Match(g));
			} else r = hxparse.LexEngine.next(r,hxparse._LexEngine.Pattern.Match([{ min : c, max : c}]));
			break;
		case 92:
			var pos3 = i++;
			c = pattern[pos3];
			if(c != c) c = 92; else if(c >= 48 && c <= 57) {
				var v = c - 48;
				while(true) {
					var cNext = pattern[i];
					if(cNext >= 48 && cNext <= 57) {
						v = v * 10 + (cNext - 48);
						++i;
					} else break;
				}
				c = v;
			}
			r = hxparse.LexEngine.next(r,hxparse._LexEngine.Pattern.Match([{ min : c, max : c}]));
			break;
		default:
			r = hxparse.LexEngine.next(r,hxparse._LexEngine.Pattern.Match([{ min : c, max : c}]));
		}
	}
	if(pDepth != 0) throw "Found unclosed parenthesis while parsing \"" + Std.string(pattern) + "\"";
	return { pattern : r, pos : i};
};
hxparse.LexEngine.prototype = {
	uid: null
	,nodes: null
	,finals: null
	,states: null
	,hstates: null
	,firstState: function() {
		return this.states[0];
	}
	,makeState: function(nodes) {
		var _g = this;
		var buf = new StringBuf();
		var _g1 = 0;
		while(_g1 < nodes.length) {
			var n = nodes[_g1];
			++_g1;
			if(n.id == null) buf.b += "null"; else buf.b += "" + n.id;
			buf.b += "-";
		}
		var key = buf.b;
		var s = this.hstates.get(key);
		if(s != null) return s;
		s = new hxparse.State();
		this.states.push(s);
		this.hstates.set(key,s);
		var trans = this.getTransitions(nodes);
		var _g2 = 0;
		while(_g2 < trans.length) {
			var t = trans[_g2];
			++_g2;
			var target = this.makeState(t.n);
			var _g11 = 0;
			var _g21 = t.chars;
			while(_g11 < _g21.length) {
				var chr = _g21[_g11];
				++_g11;
				var _g4 = chr.min;
				var _g3 = chr.max + 1;
				while(_g4 < _g3) {
					var i = _g4++;
					s.trans[i] = target;
				}
			}
		}
		var setFinal = function() {
			var _g12 = 0;
			var _g22 = _g.finals;
			while(_g12 < _g22.length) {
				var f = _g22[_g12];
				++_g12;
				var _g31 = 0;
				while(_g31 < nodes.length) {
					var n1 = nodes[_g31];
					++_g31;
					if(n1 == f) {
						s["final"] = n1.pid;
						return;
					}
				}
			}
		};
		if(s["final"] == -1) setFinal();
		return s;
	}
	,getTransitions: function(nodes) {
		var tl = [];
		var _g = 0;
		while(_g < nodes.length) {
			var n = nodes[_g];
			++_g;
			var _g1 = 0;
			var _g2 = n.trans;
			while(_g1 < _g2.length) {
				var t = _g2[_g1];
				++_g1;
				tl.push(t);
			}
		}
		tl.sort(function(t1,t2) {
			return t1.n.id - t2.n.id;
		});
		var t0 = tl[0];
		var _g11 = 1;
		var _g3 = tl.length;
		while(_g11 < _g3) {
			var i = _g11++;
			var t11 = tl[i];
			if(t0.n == t11.n) {
				tl[i - 1] = null;
				t11 = { chars : hxparse.LexEngine.cunion(t0.chars,t11.chars), n : t11.n};
				tl[i] = t11;
			}
			t0 = t11;
		}
		while(HxOverrides.remove(tl,null)) {
		}
		var allChars = hxparse.LexEngine.EMPTY;
		var allStates = new List();
		var _g4 = 0;
		while(_g4 < tl.length) {
			var t3 = tl[_g4];
			++_g4;
			var states = new List();
			states.push({ chars : hxparse.LexEngine.cdiff(t3.chars,allChars), n : [t3.n]});
			var $it0 = allStates.iterator();
			while( $it0.hasNext() ) {
				var s = $it0.next();
				var nodes1 = s.n.slice();
				nodes1.push(t3.n);
				states.push({ chars : hxparse.LexEngine.cinter(s.chars,t3.chars), n : nodes1});
				states.push({ chars : hxparse.LexEngine.cdiff(s.chars,t3.chars), n : s.n});
			}
			var $it1 = states.iterator();
			while( $it1.hasNext() ) {
				var s1 = $it1.next();
				if(s1.chars.length == 0) states.remove(s1);
			}
			allChars = hxparse.LexEngine.cunion(allChars,t3.chars);
			allStates = states;
		}
		var states1 = [];
		var $it2 = allStates.iterator();
		while( $it2.hasNext() ) {
			var s2 = $it2.next();
			states1.push({ chars : s2.chars, n : this.addNodes([],s2.n)});
		}
		states1.sort(function(s11,s21) {
			var a = s11.chars.length;
			var b = s21.chars.length;
			var _g12 = 0;
			var _g5;
			if(a < b) _g5 = a; else _g5 = b;
			while(_g12 < _g5) {
				var i1 = _g12++;
				var a1 = s11.chars[i1];
				var b1 = s21.chars[i1];
				if(a1.min != b1.min) return b1.min - a1.min;
				if(a1.max != b1.max) return b1.max - a1.max;
			}
			if(a < b) return b - a;
			return 0;
		});
		return states1;
	}
	,addNode: function(nodes,n) {
		var _g = 0;
		while(_g < nodes.length) {
			var n2 = nodes[_g];
			++_g;
			if(n == n2) return;
		}
		nodes.push(n);
		this.addNodes(nodes,n.epsilon);
	}
	,addNodes: function(nodes,add) {
		var _g = 0;
		while(_g < add.length) {
			var n = add[_g];
			++_g;
			this.addNode(nodes,n);
		}
		return nodes;
	}
	,node: function(pid) {
		return new hxparse._LexEngine.Node(this.uid++,pid);
	}
	,initNode: function(p,$final,pid) {
		switch(p[1]) {
		case 0:
			return $final;
		case 1:
			var c = p[2];
			var n = new hxparse._LexEngine.Node(this.uid++,pid);
			n.trans.push({ chars : c, n : $final});
			return n;
		case 2:
			var p1 = p[2];
			var n1 = new hxparse._LexEngine.Node(this.uid++,pid);
			var an = this.initNode(p1,n1,pid);
			n1.epsilon.push(an);
			n1.epsilon.push($final);
			return n1;
		case 3:
			var p2 = p[2];
			var n2 = new hxparse._LexEngine.Node(this.uid++,pid);
			var an1 = this.initNode(p2,n2,pid);
			n2.epsilon.push(an1);
			n2.epsilon.push($final);
			return an1;
		case 4:
			var b = p[3];
			var a = p[2];
			return this.initNode(a,this.initNode(b,$final,pid),pid);
		case 5:
			var b1 = p[3];
			var a1 = p[2];
			var n3 = new hxparse._LexEngine.Node(this.uid++,pid);
			n3.epsilon.push(this.initNode(a1,$final,pid));
			n3.epsilon.push(this.initNode(b1,$final,pid));
			return n3;
		case 6:
			var p3 = p[2];
			return this.initNode(p3,$final,pid);
		}
	}
	,__class__: hxparse.LexEngine
};
hxparse._LexEngine = {};
hxparse._LexEngine.Pattern = { __ename__ : true, __constructs__ : ["Empty","Match","Star","Plus","Next","Choice","Group"] };
hxparse._LexEngine.Pattern.Empty = ["Empty",0];
hxparse._LexEngine.Pattern.Empty.__enum__ = hxparse._LexEngine.Pattern;
hxparse._LexEngine.Pattern.Match = function(c) { var $x = ["Match",1,c]; $x.__enum__ = hxparse._LexEngine.Pattern; return $x; };
hxparse._LexEngine.Pattern.Star = function(p) { var $x = ["Star",2,p]; $x.__enum__ = hxparse._LexEngine.Pattern; return $x; };
hxparse._LexEngine.Pattern.Plus = function(p) { var $x = ["Plus",3,p]; $x.__enum__ = hxparse._LexEngine.Pattern; return $x; };
hxparse._LexEngine.Pattern.Next = function(p1,p2) { var $x = ["Next",4,p1,p2]; $x.__enum__ = hxparse._LexEngine.Pattern; return $x; };
hxparse._LexEngine.Pattern.Choice = function(p1,p2) { var $x = ["Choice",5,p1,p2]; $x.__enum__ = hxparse._LexEngine.Pattern; return $x; };
hxparse._LexEngine.Pattern.Group = function(p) { var $x = ["Group",6,p]; $x.__enum__ = hxparse._LexEngine.Pattern; return $x; };
hxparse._LexEngine.Node = function(id,pid) {
	this.id = id;
	this.pid = pid;
	this.trans = [];
	this.epsilon = [];
};
hxparse._LexEngine.Node.__name__ = ["hxparse","_LexEngine","Node"];
hxparse._LexEngine.Node.prototype = {
	id: null
	,pid: null
	,trans: null
	,epsilon: null
	,__class__: hxparse._LexEngine.Node
};
hxparse._LexEngine.Transition = function(chars) {
	this.chars = chars;
};
hxparse._LexEngine.Transition.__name__ = ["hxparse","_LexEngine","Transition"];
hxparse._LexEngine.Transition.prototype = {
	chars: null
	,toString: function() {
		return Std.string(this.chars);
	}
	,__class__: hxparse._LexEngine.Transition
};
hxparse.Lexer = function(input,sourceName) {
	if(sourceName == null) sourceName = "<null>";
	this.current = "";
	this.input = input;
	this.source = sourceName;
	this.pos = 0;
};
hxparse.Lexer.__name__ = ["hxparse","Lexer"];
hxparse.Lexer.buildRuleset = function(rules,name) {
	if(name == null) name = "";
	var cases = [];
	var functions = [];
	var eofFunction = null;
	var _g = 0;
	while(_g < rules.length) {
		var rule = rules[_g];
		++_g;
		if(rule.rule == "") eofFunction = rule.func; else {
			cases.push(hxparse.LexEngine.parse(rule.rule));
			functions.push(rule.func);
		}
	}
	return new hxparse.Ruleset(new hxparse.LexEngine(cases).firstState(),functions,eofFunction,name);
};
hxparse.Lexer.prototype = {
	current: null
	,input: null
	,source: null
	,pos: null
	,curPos: function() {
		return new hxparse.Position(this.source,this.pos - this.current.length,this.pos);
	}
	,token: function(ruleset) {
		if(this.pos == byte.js._ByteData.ByteData_Impl_.get_length(this.input)) {
			if(ruleset.eofFunction != null) return ruleset.eofFunction(this); else throw new haxe.io.Eof();
		}
		var state = ruleset.state;
		var lastMatch = null;
		var lastMatchPos = this.pos;
		var start = this.pos;
		while(true) {
			if(state["final"] > -1) {
				lastMatch = state;
				lastMatchPos = this.pos;
			}
			if(this.pos == byte.js._ByteData.ByteData_Impl_.get_length(this.input)) break;
			var i = this.input[this.pos];
			this.pos++;
			state = state.trans[i];
			if(state == null) break;
		}
		this.pos = lastMatchPos;
		this.current = byte.js._ByteData.ByteData_Impl_.readString(this.input,start,this.pos - start);
		if(lastMatch == null || lastMatch["final"] == -1) throw new hxparse.UnexpectedChar(String.fromCharCode(this.input[this.pos]),new hxparse.Position(this.source,this.pos - this.current.length,this.pos));
		return ruleset.functions[lastMatch["final"]](this);
	}
	,__class__: hxparse.Lexer
};
hxparse.NoMatch = function(pos,token) {
	this.pos = pos;
	this.token = token;
};
hxparse.NoMatch.__name__ = ["hxparse","NoMatch"];
hxparse.NoMatch.prototype = {
	pos: null
	,token: null
	,toString: function() {
		return "" + Std.string(this.pos) + ": No match: " + Std.string(this.token);
	}
	,__class__: hxparse.NoMatch
};
hxparse.Parser = function(stream,ruleset) {
	this.stream = stream;
	this.ruleset = ruleset;
};
hxparse.Parser.__name__ = ["hxparse","Parser"];
hxparse.Parser.prototype = {
	ruleset: null
	,last: null
	,stream: null
	,token: null
	,peek: function(n) {
		if(this.token == null) {
			this.token = new haxe.ds.GenericCell(this.stream.token(this.ruleset),null);
			n--;
		}
		var tok = this.token;
		while(n > 0) {
			if(tok.next == null) tok.next = new haxe.ds.GenericCell(this.stream.token(this.ruleset),null);
			tok = tok.next;
			n--;
		}
		return tok.elt;
	}
	,junk: function() {
		this.last = this.token.elt;
		this.token = this.token.next;
	}
	,curPos: function() {
		return this.stream.curPos();
	}
	,parseSeparated: function(separatorFunc,f) {
		var acc = [];
		while(true) {
			acc.push(f());
			if(separatorFunc(this.peek(0))) {
				this.last = this.token.elt;
				this.token = this.token.next;
			} else break;
		}
		return acc;
	}
	,parseOptional: function(f) {
		try {
			return f();
		} catch( e ) {
			if( js.Boot.__instanceof(e,hxparse.NoMatch) ) {
				return null;
			} else throw(e);
		}
	}
	,parseRepeat: function(f) {
		var acc = [];
		while(true) try {
			acc.push(f());
		} catch( e ) {
			if( js.Boot.__instanceof(e,hxparse.NoMatch) ) {
				return acc;
			} else throw(e);
		}
	}
	,noMatch: function() {
		return new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
	}
	,unexpected: function() {
		throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
	}
	,__class__: hxparse.Parser
};
hxparse.ParserBuilder = function() { };
hxparse.ParserBuilder.__name__ = ["hxparse","ParserBuilder"];
hxparse.Parser_qa_ArithmeticLexer_qa_ArithmeticToken = function(stream,ruleset) {
	this.stream = stream;
	this.ruleset = ruleset;
};
hxparse.Parser_qa_ArithmeticLexer_qa_ArithmeticToken.__name__ = ["hxparse","Parser_qa_ArithmeticLexer_qa_ArithmeticToken"];
hxparse.Parser_qa_ArithmeticLexer_qa_ArithmeticToken.prototype = {
	ruleset: null
	,last: null
	,stream: null
	,token: null
	,peek: function(n) {
		if(this.token == null) {
			this.token = new haxe.ds.GenericCell(this.stream.token(this.ruleset),null);
			n--;
		}
		var tok = this.token;
		while(n > 0) {
			if(tok.next == null) tok.next = new haxe.ds.GenericCell(this.stream.token(this.ruleset),null);
			tok = tok.next;
			n--;
		}
		return tok.elt;
	}
	,junk: function() {
		this.last = this.token.elt;
		this.token = this.token.next;
	}
	,curPos: function() {
		return this.stream.curPos();
	}
	,parseSeparated: function(separatorFunc,f) {
		var acc = [];
		while(true) {
			acc.push(f());
			if(separatorFunc(this.peek(0))) {
				this.last = this.token.elt;
				this.token = this.token.next;
			} else break;
		}
		return acc;
	}
	,parseOptional: function(f) {
		try {
			return f();
		} catch( e ) {
			if( js.Boot.__instanceof(e,hxparse.NoMatch) ) {
				return null;
			} else throw(e);
		}
	}
	,parseRepeat: function(f) {
		var acc = [];
		while(true) try {
			acc.push(f());
		} catch( e ) {
			if( js.Boot.__instanceof(e,hxparse.NoMatch) ) {
				return acc;
			} else throw(e);
		}
	}
	,noMatch: function() {
		return new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
	}
	,unexpected: function() {
		throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
	}
	,__class__: hxparse.Parser_qa_ArithmeticLexer_qa_ArithmeticToken
};
hxparse.Position = function(source,min,max) {
	this.psource = source;
	this.pmin = min;
	this.pmax = max;
};
hxparse.Position.__name__ = ["hxparse","Position"];
hxparse.Position.union = function(p1,p2) {
	return new hxparse.Position(p1.psource,p1.pmin < p2.pmin?p1.pmin:p2.pmin,p1.pmax > p2.pmax?p1.pmax:p2.pmax);
};
hxparse.Position.prototype = {
	psource: null
	,pmin: null
	,pmax: null
	,toString: function() {
		return "" + this.psource + ":characters " + this.pmin + "-" + this.pmax;
	}
	,getLinePosition: function(input) {
		var lineMin = 1;
		var lineMax = 1;
		var posMin = 0;
		var posMax = 0;
		var cur = 0;
		while(cur < this.pmin) {
			if(input[cur] == 10) {
				lineMin++;
				posMin = cur;
			}
			cur++;
		}
		lineMax = lineMin;
		posMax = posMin;
		posMin = cur - posMin;
		while(cur < this.pmax) {
			if(input[cur] == 10) {
				lineMax++;
				posMax = cur;
			}
			cur++;
		}
		posMax = cur - posMax;
		return { lineMin : lineMin, lineMax : lineMax, posMin : posMin, posMax : posMax};
	}
	,format: function(input) {
		var linePos = this.getLinePosition(input);
		if(linePos.lineMin != linePos.lineMax) return "" + this.psource + ":lines " + linePos.lineMin + "-" + linePos.lineMax; else return "" + this.psource + ":line " + linePos.lineMin + ":characters " + linePos.posMin + "-" + linePos.posMax;
	}
	,__class__: hxparse.Position
};
hxparse.RuleBuilder = function() { };
hxparse.RuleBuilder.__name__ = ["hxparse","RuleBuilder"];
hxparse.RuleBuilderImpl = function() { };
hxparse.RuleBuilderImpl.__name__ = ["hxparse","RuleBuilderImpl"];
hxparse.Ruleset = function(state,functions,eofFunction,name) {
	if(name == null) name = "";
	this.state = state;
	this.functions = functions;
	this.eofFunction = eofFunction;
	this.name = name;
};
hxparse.Ruleset.__name__ = ["hxparse","Ruleset"];
hxparse.Ruleset.prototype = {
	state: null
	,functions: null
	,eofFunction: null
	,name: null
	,__class__: hxparse.Ruleset
};
hxparse.State = function() {
	this["final"] = -1;
	var this1;
	this1 = new Array(256);
	this.trans = this1;
};
hxparse.State.__name__ = ["hxparse","State"];
hxparse.State.prototype = {
	trans: null
	,'final': null
	,__class__: hxparse.State
};
hxparse.Unexpected = function(token,pos) {
	this.token = token;
	this.pos = pos;
};
hxparse.Unexpected.__name__ = ["hxparse","Unexpected"];
hxparse.Unexpected.prototype = {
	token: null
	,pos: null
	,toString: function() {
		return "Unexpected " + Std.string(this.token) + " at " + Std.string(this.pos);
	}
	,__class__: hxparse.Unexpected
};
hxparse.UnexpectedChar = function($char,pos) {
	this["char"] = $char;
	this.pos = pos;
};
hxparse.UnexpectedChar.__name__ = ["hxparse","UnexpectedChar"];
hxparse.UnexpectedChar.prototype = {
	'char': null
	,pos: null
	,toString: function() {
		return "" + Std.string(this.pos) + ": Unexpected " + this["char"];
	}
	,__class__: hxparse.UnexpectedChar
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js.Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js.Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js.Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js.Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
};
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js.Boot.__interfLoop(js.Boot.getClass(o),cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
};
var qa = {};
qa.ArithmeticBinop = { __ename__ : true, __constructs__ : ["OpAdd","OpSub","OpMul","OpDiv","OpPow"] };
qa.ArithmeticBinop.OpAdd = ["OpAdd",0];
qa.ArithmeticBinop.OpAdd.__enum__ = qa.ArithmeticBinop;
qa.ArithmeticBinop.OpSub = ["OpSub",1];
qa.ArithmeticBinop.OpSub.__enum__ = qa.ArithmeticBinop;
qa.ArithmeticBinop.OpMul = ["OpMul",2];
qa.ArithmeticBinop.OpMul.__enum__ = qa.ArithmeticBinop;
qa.ArithmeticBinop.OpDiv = ["OpDiv",3];
qa.ArithmeticBinop.OpDiv.__enum__ = qa.ArithmeticBinop;
qa.ArithmeticBinop.OpPow = ["OpPow",4];
qa.ArithmeticBinop.OpPow.__enum__ = qa.ArithmeticBinop;
qa.NumberFormat = { __ename__ : true, __constructs__ : ["None","Decimal","Hexadecimal"] };
qa.NumberFormat.None = ["None",0];
qa.NumberFormat.None.__enum__ = qa.NumberFormat;
qa.NumberFormat.Decimal = ["Decimal",1];
qa.NumberFormat.Decimal.__enum__ = qa.NumberFormat;
qa.NumberFormat.Hexadecimal = ["Hexadecimal",2];
qa.NumberFormat.Hexadecimal.__enum__ = qa.NumberFormat;
qa.Constant = { __ename__ : true, __constructs__ : ["CInteger","CRational","CReal"] };
qa.Constant.CInteger = function(n,format) { var $x = ["CInteger",0,n,format]; $x.__enum__ = qa.Constant; return $x; };
qa.Constant.CRational = function(n) { var $x = ["CRational",1,n]; $x.__enum__ = qa.Constant; return $x; };
qa.Constant.CReal = function(n) { var $x = ["CReal",2,n]; $x.__enum__ = qa.Constant; return $x; };
qa.ArithmeticError = function(type) {
	this.type = type;
};
qa.ArithmeticError.__name__ = ["qa","ArithmeticError"];
qa.ArithmeticError.prototype = {
	type: null
	,__class__: qa.ArithmeticError
};
qa.MathError = { __ename__ : true, __constructs__ : ["DivisionByZero","UnsupportedOperation","Overflow"] };
qa.MathError.DivisionByZero = ["DivisionByZero",0];
qa.MathError.DivisionByZero.__enum__ = qa.MathError;
qa.MathError.UnsupportedOperation = function(msg) { var $x = ["UnsupportedOperation",1,msg]; $x.__enum__ = qa.MathError; return $x; };
qa.MathError.Overflow = ["Overflow",2];
qa.MathError.Overflow.__enum__ = qa.MathError;
qa._Arithmetic = {};
qa._Arithmetic.Real_Impl_ = function() { };
qa._Arithmetic.Real_Impl_.__name__ = ["qa","_Arithmetic","Real_Impl_"];
qa._Arithmetic.Real_Impl_.fromString = function(s) {
	var n = Std.parseFloat(s);
	if(Math.isNaN(n)) throw "Unable to convert from String to Float: " + s;
	return js.Boot.__cast(n , Float);
};
qa._Arithmetic.Real_Impl_.toString = function(n) {
	return "" + n;
};
qa._Arithmetic.Real_Impl_.negate = function(n) {
	return -n;
};
qa._Arithmetic.Real_Impl_.abs = function(n) {
	if(qa._Arithmetic.Real_Impl_.lessThan(n,0)) return -n; else return n;
};
qa._Arithmetic.Real_Impl_.pow = function(a,b) {
	return Math.pow(a,b);
};
qa._Arithmetic.Real_Impl_.add = function(a,b) {
	return a + b;
};
qa._Arithmetic.Real_Impl_.subtract = function(a,b) {
	return a - b;
};
qa._Arithmetic.Real_Impl_.multiply = function(a,b) {
	return a * b;
};
qa._Arithmetic.Real_Impl_.divide = function(a,b) {
	return a / b;
};
qa._Arithmetic.Real_Impl_.greaterThan = function(a,b) {
	return a > b;
};
qa._Arithmetic.Real_Impl_.lessThan = function(a,b) {
	return a < b;
};
qa._Arithmetic.SimpleFraction_Impl_ = function() { };
qa._Arithmetic.SimpleFraction_Impl_.__name__ = ["qa","_Arithmetic","SimpleFraction_Impl_"];
qa._Arithmetic.SimpleFraction_Impl_.toReal = function(n) {
	var v = n;
	return qa._Arithmetic.Real_Impl_.divide(qa._Arithmetic.Integer_Impl_.toReal(v.a),qa._Arithmetic.Integer_Impl_.toReal(v.b));
};
qa._Arithmetic.SimpleFraction_Impl_.getNumerator = function(this1) {
	return this1.a;
};
qa._Arithmetic.SimpleFraction_Impl_.getDenominator = function(this1) {
	return this1.b;
};
qa._Arithmetic.SimpleFraction_Impl_.gcd = function(this1) {
	var d = 0;
	var r = 0;
	var a;
	var n = this1.a;
	if(qa._Arithmetic.Integer_Impl_.lessThan(n,0)) a = -n; else a = n;
	var b;
	var n1 = this1.b;
	if(qa._Arithmetic.Integer_Impl_.lessThan(n1,0)) b = -n1; else b = n1;
	while(true) if(b == 0) {
		d = a;
		break;
	} else {
		r = a % b;
		a = b;
		b = r;
	}
	return d;
};
qa._Arithmetic.SimpleFraction_Impl_.post = function(this1) {
	qa._Arithmetic.SimpleFraction_Impl_.simplify(this1);
};
qa._Arithmetic.SimpleFraction_Impl_.simplify = function(this1) {
	qa._Arithmetic.SimpleFraction_Impl_.reduce(this1);
	var v = this1;
	if(qa._Arithmetic.Integer_Impl_.lessThan(v.a,0) && qa._Arithmetic.Integer_Impl_.lessThan(v.b,0)) {
		v.a = -v.a;
		v.b = -v.b;
	}
};
qa._Arithmetic.SimpleFraction_Impl_.reduce = function(this1) {
	var d = qa._Arithmetic.SimpleFraction_Impl_.gcd(this1);
	var v = this1;
	v.a = Math.floor(v.a / d);
	v.b = Math.floor(v.b / d);
};
qa._Arithmetic.SimpleFraction_Impl_.pow = function(a,b) {
	var va = a;
	var vb = b;
	if(vb.b != 1) throw new qa.ArithmeticError(qa.MathError.UnsupportedOperation("Fractional powers not supported"));
	var r = { a : (function($this) {
		var $r;
		var f = Math.pow(va.a,vb.a);
		if(!Math.isFinite(f)) throw new qa.ArithmeticError(qa.MathError.Overflow);
		$r = Math.floor(f);
		return $r;
	}(this)), b : (function($this) {
		var $r;
		var f1 = Math.pow(va.b,vb.a);
		if(!Math.isFinite(f1)) throw new qa.ArithmeticError(qa.MathError.Overflow);
		$r = Math.floor(f1);
		return $r;
	}(this))};
	qa._Arithmetic.SimpleFraction_Impl_.post(r);
	return r;
};
qa._Arithmetic.SimpleFraction_Impl_.negate = function(n) {
	return qa._Arithmetic.SimpleFraction_Impl_.subtract(qa._Arithmetic.SimpleFraction_Impl_.ZERO,n);
};
qa._Arithmetic.SimpleFraction_Impl_.add = function(a,b) {
	var va = a;
	var vb = b;
	var r = { a : qa._Arithmetic.Integer_Impl_.add(qa._Arithmetic.Integer_Impl_.multiply(va.a,vb.b),qa._Arithmetic.Integer_Impl_.multiply(vb.a,va.b)), b : qa._Arithmetic.Integer_Impl_.multiply(va.b,vb.b)};
	qa._Arithmetic.SimpleFraction_Impl_.post(r);
	return r;
};
qa._Arithmetic.SimpleFraction_Impl_.subtract = function(a,b) {
	var va = a;
	var vb = b;
	var r = { a : qa._Arithmetic.Integer_Impl_.subtract(qa._Arithmetic.Integer_Impl_.multiply(va.a,vb.b),qa._Arithmetic.Integer_Impl_.multiply(vb.a,va.b)), b : qa._Arithmetic.Integer_Impl_.multiply(va.b,vb.b)};
	qa._Arithmetic.SimpleFraction_Impl_.post(r);
	return r;
};
qa._Arithmetic.SimpleFraction_Impl_.multiply = function(a,b) {
	var va = a;
	var vb = b;
	var r = { a : qa._Arithmetic.Integer_Impl_.multiply(va.a,vb.a), b : qa._Arithmetic.Integer_Impl_.multiply(va.b,vb.b)};
	qa._Arithmetic.SimpleFraction_Impl_.post(r);
	return r;
};
qa._Arithmetic.SimpleFraction_Impl_.divide = function(a,b) {
	var va = a;
	var vb = b;
	if(qa._Arithmetic.Integer_Impl_.toSimpleFraction(vb.a) == qa._Arithmetic.SimpleFraction_Impl_.ZERO) throw new qa.ArithmeticError(qa.MathError.DivisionByZero);
	var r = { a : qa._Arithmetic.Integer_Impl_.multiply(va.a,vb.b), b : qa._Arithmetic.Integer_Impl_.multiply(va.b,vb.a)};
	qa._Arithmetic.SimpleFraction_Impl_.post(r);
	return r;
};
qa._Arithmetic.Integer_Impl_ = function() { };
qa._Arithmetic.Integer_Impl_.__name__ = ["qa","_Arithmetic","Integer_Impl_"];
qa._Arithmetic.Integer_Impl_.fromString = function(s) {
	var n = Std.parseInt(s);
	if(n == null) throw "Unable to convert from String to Integer: " + s;
	var t = n;
	return js.Boot.__cast(t , Int);
};
qa._Arithmetic.Integer_Impl_.toString = function(n) {
	return "" + n;
};
qa._Arithmetic.Integer_Impl_.toSimpleFraction = function(n) {
	return { a : n, b : 1};
};
qa._Arithmetic.Integer_Impl_.negate = function(n) {
	return -n;
};
qa._Arithmetic.Integer_Impl_.abs = function(n) {
	if(qa._Arithmetic.Integer_Impl_.lessThan(n,0)) return -n; else return n;
};
qa._Arithmetic.Integer_Impl_.divideInteger = function(a,b) {
	return Math.floor(a / b);
};
qa._Arithmetic.Integer_Impl_.pow = function(a,b) {
	var f = Math.pow(a,b);
	if(!Math.isFinite(f)) throw new qa.ArithmeticError(qa.MathError.Overflow);
	return Math.floor(f);
};
qa._Arithmetic.Integer_Impl_.toReal = function(n) {
	return n;
};
qa._Arithmetic.Integer_Impl_.add = function(a,b) {
	return a + b;
};
qa._Arithmetic.Integer_Impl_.subtract = function(a,b) {
	return a - b;
};
qa._Arithmetic.Integer_Impl_.multiply = function(a,b) {
	return a * b;
};
qa._Arithmetic.Integer_Impl_.divide = function(a,b) {
	return { a : a, b : b};
};
qa._Arithmetic.Integer_Impl_.greaterThan = function(a,b) {
	return a > b;
};
qa._Arithmetic.Integer_Impl_.lessThan = function(a,b) {
	return a < b;
};
qa.ArithmeticToken = { __ename__ : true, __constructs__ : ["TConst","TPOpen","TPClose","TBinop","TEof"] };
qa.ArithmeticToken.TConst = function(c) { var $x = ["TConst",0,c]; $x.__enum__ = qa.ArithmeticToken; return $x; };
qa.ArithmeticToken.TPOpen = ["TPOpen",1];
qa.ArithmeticToken.TPOpen.__enum__ = qa.ArithmeticToken;
qa.ArithmeticToken.TPClose = ["TPClose",2];
qa.ArithmeticToken.TPClose.__enum__ = qa.ArithmeticToken;
qa.ArithmeticToken.TBinop = function(op) { var $x = ["TBinop",3,op]; $x.__enum__ = qa.ArithmeticToken; return $x; };
qa.ArithmeticToken.TEof = ["TEof",4];
qa.ArithmeticToken.TEof.__enum__ = qa.ArithmeticToken;
qa.ArithmeticExpr = { __ename__ : true, __constructs__ : ["EConst","EBinop","EParenthesis","ENeg"] };
qa.ArithmeticExpr.EConst = function(c) { var $x = ["EConst",0,c]; $x.__enum__ = qa.ArithmeticExpr; return $x; };
qa.ArithmeticExpr.EBinop = function(op,e1,e2) { var $x = ["EBinop",1,op,e1,e2]; $x.__enum__ = qa.ArithmeticExpr; return $x; };
qa.ArithmeticExpr.EParenthesis = function(e) { var $x = ["EParenthesis",2,e]; $x.__enum__ = qa.ArithmeticExpr; return $x; };
qa.ArithmeticExpr.ENeg = function(e) { var $x = ["ENeg",3,e]; $x.__enum__ = qa.ArithmeticExpr; return $x; };
qa.ArithmeticPrinter = function() { };
qa.ArithmeticPrinter.__name__ = ["qa","ArithmeticPrinter"];
qa.ArithmeticPrinter.getTag = function(s) {
	return "<span class=\"tag tag-" + s + "\">" + s + "</span>";
};
qa.ArithmeticPrinter.getExpressionTag = function(e) {
	return qa.ArithmeticPrinter.getTag((function($this) {
		var $r;
		switch(e[1]) {
		case 0:
			$r = "const";
			break;
		case 1:
			$r = "binop";
			break;
		case 2:
			$r = "paren";
			break;
		case 3:
			$r = "neg";
			break;
		}
		return $r;
	}(this)));
};
qa.ArithmeticPrinter.printEvalStep = function(step) {
	var type;
	{
		var _g = step.type;
		switch(_g[1]) {
		case 2:
			var p = _g[3];
			var c = _g[2];
			type = qa.ArithmeticPrinter.getTag("promoted") + ("" + qa.ArithmeticPrinter.printConstant(c) + " to " + qa.ArithmeticPrinter.printConstant(p));
			break;
		case 0:
			var e = _g[2];
			var expr;
			switch(e[1]) {
			case 0:
				var c1 = e[2];
				expr = qa.ArithmeticPrinter.printConstant(c1);
				break;
			case 1:
				var e2 = e[4];
				var e1 = e[3];
				var c2 = e[2];
				expr = qa.ArithmeticPrinter.printTexInline(e);
				break;
			case 2:
				var e3 = e[2];
				expr = "";
				break;
			case 3:
				var e4 = e[2];
				expr = qa.ArithmeticPrinter.printTexInline(e4);
				break;
			}
			type = qa.ArithmeticPrinter.getExpressionTag(e) + expr;
			break;
		case 1:
			var c3 = _g[2];
			type = qa.ArithmeticPrinter.getTag("result") + " \\(\\rightarrow\\) " + qa.ArithmeticPrinter.printConstant(c3);
			break;
		}
	}
	return "<div class=\"step\" style=\"margin-left: " + step.level + "em;\">" + type + "</div>";
};
qa.ArithmeticPrinter.printConstant = function(c) {
	var type;
	switch(c[1]) {
	case 0:
		type = "integer";
		break;
	case 1:
		type = "rational";
		break;
	case 2:
		type = "real";
		break;
	}
	return "" + type + " \\(" + qa.ArithmeticPrinter.printTexMath(qa.ArithmeticExpr.EConst(c)) + "\\)";
};
qa.ArithmeticPrinter.printTex = function(expr) {
	return "$$" + qa.ArithmeticPrinter.printTexMath(expr) + "$$";
};
qa.ArithmeticPrinter.printTexInline = function(expr) {
	return "\\(" + qa.ArithmeticPrinter.printTexMath(expr) + "\\)";
};
qa.ArithmeticPrinter.printTexMath = function(expr) {
	switch(expr[1]) {
	case 0:
		var c = expr[2];
		switch(c[1]) {
		case 0:
			var format = c[3];
			var n = c[2];
			switch(format[1]) {
			case 1:case 0:
				return qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add("",n));
			case 2:
				return "\\mathtt{" + StringTools.hex(n,0) + "}_{16}";
			}
			break;
		case 1:
			var n1 = c[2];
			return "\\left(\\frac{" + qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.SimpleFraction_Impl_.getNumerator(n1)) + "}{" + qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.SimpleFraction_Impl_.getDenominator(n1)) + "}\\right)";
		case 2:
			var n2 = c[2];
			return "" + qa._Arithmetic.Real_Impl_.toString(n2);
		}
		break;
	case 1:
		var e2 = expr[4];
		var e1 = expr[3];
		var op = expr[2];
		var p1 = qa.ArithmeticPrinter.printTexMath(e1);
		var p2 = qa.ArithmeticPrinter.printTexMath(e2);
		switch(op[1]) {
		case 0:
			return "" + p1 + " + " + p2;
		case 1:
			return "" + p1 + " - " + p2;
		case 2:
			return "" + p1 + " \\times " + p2;
		case 4:
			return "" + p1 + "^{" + p2 + "}";
		case 3:
			p1 = qa.ArithmeticPrinter.printTexMath(qa.ArithmeticPrinter.escapeParens(e1));
			p2 = qa.ArithmeticPrinter.printTexMath(qa.ArithmeticPrinter.escapeParens(e2));
			return "\\frac{" + p1 + "}{" + p2 + "}";
		}
		break;
	case 2:
		var e = expr[2];
		return "\\left(" + qa.ArithmeticPrinter.printTexMath(e) + "\\right)";
	case 3:
		var e3 = expr[2];
		return "-" + qa.ArithmeticPrinter.printTexMath(e3);
	}
};
qa.ArithmeticPrinter.escapeParens = function(expr) {
	switch(expr[1]) {
	case 2:
		var e = expr[2];
		return qa.ArithmeticPrinter.escapeParens(e);
	default:
		return expr;
	}
};
qa.ArithmeticLexer = function() {
	hxparse.Lexer.call(this,null);
};
qa.ArithmeticLexer.__name__ = ["qa","ArithmeticLexer"];
qa.ArithmeticLexer.__interfaces__ = [hxparse.RuleBuilder];
qa.ArithmeticLexer.__super__ = hxparse.Lexer;
qa.ArithmeticLexer.prototype = $extend(hxparse.Lexer.prototype,{
	reset: function(input,sourceName) {
		if(sourceName == null) sourceName = "<input>";
		this.current = "";
		this.input = input;
		this.source = sourceName;
		this.pos = 0;
	}
	,__class__: qa.ArithmeticLexer
});
qa.ArithmeticParser = function(stream,ruleset) {
	this.steps = new Array();
	hxparse.Parser_qa_ArithmeticLexer_qa_ArithmeticToken.call(this,stream,ruleset);
};
qa.ArithmeticParser.__name__ = ["qa","ArithmeticParser"];
qa.ArithmeticParser.__interfaces__ = [hxparse.ParserBuilder];
qa.ArithmeticParser.__super__ = hxparse.Parser_qa_ArithmeticLexer_qa_ArithmeticToken;
qa.ArithmeticParser.prototype = $extend(hxparse.Parser_qa_ArithmeticLexer_qa_ArithmeticToken.prototype,{
	steps: null
	,reset: function() {
		this.token = null;
		this.steps.splice(0,this.steps.length);
	}
	,step: function(msg) {
		this.steps.push(msg);
	}
	,peek: function(n) {
		var t = hxparse.Parser_qa_ArithmeticLexer_qa_ArithmeticToken.prototype.peek.call(this,n);
		this.step("peek(" + n + "): " + Std.string(t));
		return t;
	}
	,parse: function() {
		var e;
		{
			var _g = this.peek(0);
			switch(_g[1]) {
			case 3:
				switch(_g[2][1]) {
				case 1:
					this.last = this.token.elt;
					this.token = this.token.next;
					var e1 = this.parseElement();
					e = this.parseNext(qa.ArithmeticExpr.ENeg(e1));
					break;
				default:
					e = this.parseNext(this.parseElement());
				}
				break;
			default:
				e = this.parseNext(this.parseElement());
			}
		}
		return e;
	}
	,parseElement: function() {
		{
			var _g = this.peek(0);
			switch(_g[1]) {
			case 0:
				var c = _g[2];
				this.last = this.token.elt;
				this.token = this.token.next;
				this.step("const " + Std.string(c));
				return qa.ArithmeticExpr.EConst(c);
			case 1:
				this.last = this.token.elt;
				this.token = this.token.next;
				var e = this.parse();
				var _g1 = this.peek(0);
				switch(_g1[1]) {
				case 2:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.step("paren " + Std.string(e));
					return qa.ArithmeticExpr.EParenthesis(e);
				default:
					throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
				}
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,parseNext: function(e1) {
		{
			var _g = this.peek(0);
			switch(_g[1]) {
			case 3:
				var op = _g[2];
				this.last = this.token.elt;
				this.token = this.token.next;
				var e2 = this.parse();
				this.step("binop " + Std.string(op) + " " + Std.string(e1) + " " + Std.string(e2));
				return this.binop(e1,op,e2);
			default:
				this.step("pass " + Std.string(e1));
				return e1;
			}
		}
	}
	,binop: function(e1,op,e2) {
		switch(e2[1]) {
		case 1:
			var op2 = e2[2];
			switch(e2[2][1]) {
			case 0:
				var op1 = op;
				switch(op[1]) {
				case 2:
					var e3 = e2[3];
					var e4 = e2[4];
					this.step("binopswitch e1=" + Std.string(e1) + " op=" + Std.string(op1) + " e2=" + Std.string(e2) + " op2=" + Std.string(op2) + " e3=" + Std.string(e3) + " e4=" + Std.string(e4));
					return qa.ArithmeticExpr.EBinop(op2,qa.ArithmeticExpr.EBinop(op1,e1,e3),e4);
				case 3:
					var e3 = e2[3];
					var e4 = e2[4];
					this.step("binopswitch e1=" + Std.string(e1) + " op=" + Std.string(op1) + " e2=" + Std.string(e2) + " op2=" + Std.string(op2) + " e3=" + Std.string(e3) + " e4=" + Std.string(e4));
					return qa.ArithmeticExpr.EBinop(op2,qa.ArithmeticExpr.EBinop(op1,e1,e3),e4);
				case 4:
					var e3 = e2[3];
					var e4 = e2[4];
					this.step("binopswitch e1=" + Std.string(e1) + " op=" + Std.string(op1) + " e2=" + Std.string(e2) + " op2=" + Std.string(op2) + " e3=" + Std.string(e3) + " e4=" + Std.string(e4));
					return qa.ArithmeticExpr.EBinop(op2,qa.ArithmeticExpr.EBinop(op1,e1,e3),e4);
				default:
					this.step("binoppass " + Std.string(e1) + " " + Std.string(op) + " " + Std.string(e2));
					return qa.ArithmeticExpr.EBinop(op,e1,e2);
				}
				break;
			case 1:
				var op1 = op;
				switch(op[1]) {
				case 2:case 3:
					var e3 = e2[3];
					var e4 = e2[4];
					this.step("binopswitch e1=" + Std.string(e1) + " op=" + Std.string(op1) + " e2=" + Std.string(e2) + " op2=" + Std.string(op2) + " e3=" + Std.string(e3) + " e4=" + Std.string(e4));
					return qa.ArithmeticExpr.EBinop(op2,qa.ArithmeticExpr.EBinop(op1,e1,e3),e4);
				case 4:
					var e3 = e2[3];
					var e4 = e2[4];
					this.step("binopswitch e1=" + Std.string(e1) + " op=" + Std.string(op1) + " e2=" + Std.string(e2) + " op2=" + Std.string(op2) + " e3=" + Std.string(e3) + " e4=" + Std.string(e4));
					return qa.ArithmeticExpr.EBinop(op2,qa.ArithmeticExpr.EBinop(op1,e1,e3),e4);
				default:
					this.step("binoppass " + Std.string(e1) + " " + Std.string(op) + " " + Std.string(e2));
					return qa.ArithmeticExpr.EBinop(op,e1,e2);
				}
				break;
			case 2:
				var op1 = op;
				switch(op[1]) {
				case 3:
					var e3 = e2[3];
					var e4 = e2[4];
					this.step("binopswitch e1=" + Std.string(e1) + " op=" + Std.string(op1) + " e2=" + Std.string(e2) + " op2=" + Std.string(op2) + " e3=" + Std.string(e3) + " e4=" + Std.string(e4));
					return qa.ArithmeticExpr.EBinop(op2,qa.ArithmeticExpr.EBinop(op1,e1,e3),e4);
				case 4:
					var e3 = e2[3];
					var e4 = e2[4];
					this.step("binopswitch e1=" + Std.string(e1) + " op=" + Std.string(op1) + " e2=" + Std.string(e2) + " op2=" + Std.string(op2) + " e3=" + Std.string(e3) + " e4=" + Std.string(e4));
					return qa.ArithmeticExpr.EBinop(op2,qa.ArithmeticExpr.EBinop(op1,e1,e3),e4);
				default:
					this.step("binoppass " + Std.string(e1) + " " + Std.string(op) + " " + Std.string(e2));
					return qa.ArithmeticExpr.EBinop(op,e1,e2);
				}
				break;
			default:
				var op1 = op;
				switch(op[1]) {
				case 4:
					var e3 = e2[3];
					var e4 = e2[4];
					this.step("binopswitch e1=" + Std.string(e1) + " op=" + Std.string(op1) + " e2=" + Std.string(e2) + " op2=" + Std.string(op2) + " e3=" + Std.string(e3) + " e4=" + Std.string(e4));
					return qa.ArithmeticExpr.EBinop(op2,qa.ArithmeticExpr.EBinop(op1,e1,e3),e4);
				default:
					this.step("binoppass " + Std.string(e1) + " " + Std.string(op) + " " + Std.string(e2));
					return qa.ArithmeticExpr.EBinop(op,e1,e2);
				}
			}
			break;
		default:
			this.step("binoppass " + Std.string(e1) + " " + Std.string(op) + " " + Std.string(e2));
			return qa.ArithmeticExpr.EBinop(op,e1,e2);
		}
	}
	,__class__: qa.ArithmeticParser
});
qa.EvalStepType = { __ename__ : true, __constructs__ : ["Expression","Result","Promote"] };
qa.EvalStepType.Expression = function(e) { var $x = ["Expression",0,e]; $x.__enum__ = qa.EvalStepType; return $x; };
qa.EvalStepType.Result = function(c) { var $x = ["Result",1,c]; $x.__enum__ = qa.EvalStepType; return $x; };
qa.EvalStepType.Promote = function(c,p) { var $x = ["Promote",2,c,p]; $x.__enum__ = qa.EvalStepType; return $x; };
qa.EvalState = function() {
	this.steps = new List();
};
qa.EvalState.__name__ = ["qa","EvalState"];
qa.EvalState.prototype = {
	currentLevel: null
	,steps: null
	,addStep: function(type) {
		this.steps.add({ type : type, level : this.currentLevel});
	}
	,__class__: qa.EvalState
};
qa.ArithmeticEvaluator = function() { };
qa.ArithmeticEvaluator.__name__ = ["qa","ArithmeticEvaluator"];
qa.ArithmeticEvaluator.getConstantRank = function(c) {
	switch(c[1]) {
	case 0:
		return 0;
	case 1:
		return 1;
	case 2:
		return 2;
	}
};
qa.ArithmeticEvaluator.changeRank = function(c,base,state) {
	var rb = qa.ArithmeticEvaluator.getConstantRank(base);
	var rc = qa.ArithmeticEvaluator.getConstantRank(c);
	while(rc != rb) {
		if(rc < rb) {
			var p = qa.ArithmeticEvaluator.promoteConst(c);
			state.addStep(qa.EvalStepType.Promote(c,p));
			c = p;
		} else throw "Constant demotion not supported";
		var nrc = qa.ArithmeticEvaluator.getConstantRank(c);
		if(nrc == rc) throw "Constant rank change error " + Std.string(c) + "(" + rc + " == " + nrc + ") " + Std.string(base) + "(" + rb + ")";
		rc = nrc;
	}
	return c;
};
qa.ArithmeticEvaluator.promoteConst = function(c) {
	switch(c[1]) {
	case 0:
		var n = c[2];
		return qa.Constant.CRational(qa._Arithmetic.Integer_Impl_.toSimpleFraction(n));
	case 1:
		var n1 = c[2];
		return qa.Constant.CReal(qa._Arithmetic.SimpleFraction_Impl_.toReal(n1));
	default:
		throw "Unimplemented rank promotion for " + Std.string(c);
	}
};
qa.ArithmeticEvaluator["eval"] = function(e,state) {
	state.currentLevel++;
	switch(e[1]) {
	case 0:case 2:
		break;
	default:
		state.addStep(qa.EvalStepType.Expression(e));
	}
	var result;
	switch(e[1]) {
	case 0:
		var c = e[2];
		result = c;
		break;
	case 1:
		var e2 = e[4];
		var e1 = e[3];
		var op = e[2];
		switch(e1[1]) {
		case 0:
			var a = e1[2];
			switch(e1[2][1]) {
			case 0:
				switch(e2[1]) {
				case 0:
					var b = e2[2];
					switch(e2[2][1]) {
					case 0:
						var a1 = e1[2][2];
						var opa = e1[2][3];
						var opb = e2[2][3];
						var b1 = e2[2][2];
						var format;
						switch(opa[1]) {
						case 2:
							switch(opb[1]) {
							case 2:
								format = qa.NumberFormat.Hexadecimal;
								break;
							case 1:
								format = qa.NumberFormat.Decimal;
								break;
							default:
								format = qa.NumberFormat.None;
							}
							break;
						case 1:
							switch(opb[1]) {
							case 2:case 1:
								format = qa.NumberFormat.Decimal;
								break;
							default:
								format = qa.NumberFormat.None;
							}
							break;
						default:
							format = qa.NumberFormat.None;
						}
						switch(op[1]) {
						case 0:
							result = qa.Constant.CInteger(qa._Arithmetic.Integer_Impl_.add(a1,b1),format);
							break;
						case 1:
							result = qa.Constant.CInteger(qa._Arithmetic.Integer_Impl_.subtract(a1,b1),format);
							break;
						case 2:
							result = qa.Constant.CInteger(qa._Arithmetic.Integer_Impl_.multiply(a1,b1),format);
							break;
						case 3:
							result = qa.Constant.CRational(qa._Arithmetic.Integer_Impl_.divide(a1,b1));
							break;
						case 4:
							result = qa.Constant.CInteger((function($this) {
								var $r;
								var f = Math.pow(a1,b1);
								if(!Math.isFinite(f)) throw new qa.ArithmeticError(qa.MathError.Overflow);
								$r = Math.floor(f);
								return $r;
							}(this)),qa.NumberFormat.None);
							break;
						}
						break;
					default:
						var ra = qa.ArithmeticEvaluator.getConstantRank(a);
						var rb = qa.ArithmeticEvaluator.getConstantRank(b);
						if(ra == rb) throw "Unimplemented binop " + Std.string(op) + " " + Std.string(e1) + " " + Std.string(e2);
						result = qa.ArithmeticEvaluator["eval"](rb > ra?qa.ArithmeticExpr.EBinop(op,qa.ArithmeticExpr.EConst(qa.ArithmeticEvaluator.changeRank(a,b,state)),e2):qa.ArithmeticExpr.EBinop(op,e1,qa.ArithmeticExpr.EConst(qa.ArithmeticEvaluator.changeRank(b,a,state))),state);
					}
					break;
				default:
					result = qa.ArithmeticEvaluator["eval"](qa.ArithmeticExpr.EBinop(op,qa.ArithmeticExpr.EConst(qa.ArithmeticEvaluator["eval"](e1,state)),qa.ArithmeticExpr.EConst(qa.ArithmeticEvaluator["eval"](e2,state))),state);
				}
				break;
			case 1:
				switch(e2[1]) {
				case 0:
					var b = e2[2];
					switch(e2[2][1]) {
					case 1:
						var a2 = e1[2][2];
						var b2 = e2[2][2];
						switch(op[1]) {
						case 0:
							result = qa.Constant.CRational(qa._Arithmetic.SimpleFraction_Impl_.add(a2,b2));
							break;
						case 1:
							result = qa.Constant.CRational(qa._Arithmetic.SimpleFraction_Impl_.subtract(a2,b2));
							break;
						case 2:
							result = qa.Constant.CRational(qa._Arithmetic.SimpleFraction_Impl_.multiply(a2,b2));
							break;
						case 3:
							result = qa.Constant.CRational(qa._Arithmetic.SimpleFraction_Impl_.divide(a2,b2));
							break;
						case 4:
							result = qa.Constant.CRational((function($this) {
								var $r;
								var va = a2;
								var vb = b2;
								if(vb.b != 1) throw new qa.ArithmeticError(qa.MathError.UnsupportedOperation("Fractional powers not supported"));
								var r = { a : (function($this) {
									var $r;
									var f1 = Math.pow(va.a,vb.a);
									if(!Math.isFinite(f1)) throw new qa.ArithmeticError(qa.MathError.Overflow);
									$r = Math.floor(f1);
									return $r;
								}($this)), b : (function($this) {
									var $r;
									var f2 = Math.pow(va.b,vb.a);
									if(!Math.isFinite(f2)) throw new qa.ArithmeticError(qa.MathError.Overflow);
									$r = Math.floor(f2);
									return $r;
								}($this))};
								qa._Arithmetic.SimpleFraction_Impl_.post(r);
								$r = r;
								return $r;
							}(this)));
							break;
						}
						break;
					default:
						var ra = qa.ArithmeticEvaluator.getConstantRank(a);
						var rb = qa.ArithmeticEvaluator.getConstantRank(b);
						if(ra == rb) throw "Unimplemented binop " + Std.string(op) + " " + Std.string(e1) + " " + Std.string(e2);
						result = qa.ArithmeticEvaluator["eval"](rb > ra?qa.ArithmeticExpr.EBinop(op,qa.ArithmeticExpr.EConst(qa.ArithmeticEvaluator.changeRank(a,b,state)),e2):qa.ArithmeticExpr.EBinop(op,e1,qa.ArithmeticExpr.EConst(qa.ArithmeticEvaluator.changeRank(b,a,state))),state);
					}
					break;
				default:
					result = qa.ArithmeticEvaluator["eval"](qa.ArithmeticExpr.EBinop(op,qa.ArithmeticExpr.EConst(qa.ArithmeticEvaluator["eval"](e1,state)),qa.ArithmeticExpr.EConst(qa.ArithmeticEvaluator["eval"](e2,state))),state);
				}
				break;
			case 2:
				switch(e2[1]) {
				case 0:
					var b = e2[2];
					switch(e2[2][1]) {
					case 2:
						var a3 = e1[2][2];
						var b3 = e2[2][2];
						switch(op[1]) {
						case 0:
							result = qa.Constant.CReal(qa._Arithmetic.Real_Impl_.add(a3,b3));
							break;
						case 1:
							result = qa.Constant.CReal(qa._Arithmetic.Real_Impl_.subtract(a3,b3));
							break;
						case 2:
							result = qa.Constant.CReal(qa._Arithmetic.Real_Impl_.multiply(a3,b3));
							break;
						case 3:
							result = qa.Constant.CReal(qa._Arithmetic.Real_Impl_.divide(a3,b3));
							break;
						case 4:
							result = qa.Constant.CReal(Math.pow(a3,b3));
							break;
						}
						break;
					default:
						var ra = qa.ArithmeticEvaluator.getConstantRank(a);
						var rb = qa.ArithmeticEvaluator.getConstantRank(b);
						if(ra == rb) throw "Unimplemented binop " + Std.string(op) + " " + Std.string(e1) + " " + Std.string(e2);
						result = qa.ArithmeticEvaluator["eval"](rb > ra?qa.ArithmeticExpr.EBinop(op,qa.ArithmeticExpr.EConst(qa.ArithmeticEvaluator.changeRank(a,b,state)),e2):qa.ArithmeticExpr.EBinop(op,e1,qa.ArithmeticExpr.EConst(qa.ArithmeticEvaluator.changeRank(b,a,state))),state);
					}
					break;
				default:
					result = qa.ArithmeticEvaluator["eval"](qa.ArithmeticExpr.EBinop(op,qa.ArithmeticExpr.EConst(qa.ArithmeticEvaluator["eval"](e1,state)),qa.ArithmeticExpr.EConst(qa.ArithmeticEvaluator["eval"](e2,state))),state);
				}
				break;
			}
			break;
		default:
			result = qa.ArithmeticEvaluator["eval"](qa.ArithmeticExpr.EBinop(op,qa.ArithmeticExpr.EConst(qa.ArithmeticEvaluator["eval"](e1,state)),qa.ArithmeticExpr.EConst(qa.ArithmeticEvaluator["eval"](e2,state))),state);
		}
		break;
	case 2:
		var e11 = e[2];
		result = qa.ArithmeticEvaluator["eval"](e11,state);
		break;
	case 3:
		var e3 = e[2];
		switch(e3[1]) {
		case 0:
			switch(e3[2][1]) {
			case 0:
				var format1 = e3[2][3];
				var n = e3[2][2];
				result = qa.Constant.CInteger(-n,format1);
				break;
			case 1:
				var n1 = e3[2][2];
				result = qa.Constant.CRational(qa._Arithmetic.SimpleFraction_Impl_.subtract(qa._Arithmetic.SimpleFraction_Impl_.ZERO,n1));
				break;
			default:
				if((function($this) {
					var $r;
					switch(e3[1]) {
					case 0:
						$r = true;
						break;
					default:
						$r = false;
					}
					return $r;
				}(this))) throw "Unimplemented negation " + Std.string(e3);
				result = qa.ArithmeticEvaluator["eval"](qa.ArithmeticExpr.ENeg(qa.ArithmeticExpr.EConst(qa.ArithmeticEvaluator["eval"](e3,state))),state);
			}
			break;
		default:
			if((function($this) {
				var $r;
				switch(e3[1]) {
				case 0:
					$r = true;
					break;
				default:
					$r = false;
				}
				return $r;
			}(this))) throw "Unimplemented negation " + Std.string(e3);
			result = qa.ArithmeticEvaluator["eval"](qa.ArithmeticExpr.ENeg(qa.ArithmeticExpr.EConst(qa.ArithmeticEvaluator["eval"](e3,state))),state);
		}
		break;
	}
	state.currentLevel--;
	switch(e[1]) {
	case 0:case 2:
		break;
	default:
		state.addStep(qa.EvalStepType.Result(result));
	}
	return result;
};
qa.Ksi = function() {
	this.lexer = new qa.ArithmeticLexer();
	this.parser = new qa.ArithmeticParser(this.lexer,qa.ArithmeticLexer.tok);
};
qa.Ksi.__name__ = ["qa","Ksi"];
qa.Ksi.prototype = {
	lexer: null
	,parser: null
	,answer: function(text) {
		var bytes = byte.js._ByteData.ByteData_Impl_.ofString(text);
		var tokens = "";
		this.lexer.reset(bytes);
		var tok;
		while((tok = this.lexer.token(qa.ArithmeticLexer.tok)) != qa.ArithmeticToken.TEof) tokens += Std.string(tok) + "<br/>";
		this.lexer.reset(bytes);
		this.parser.reset();
		var expr = this.parser.parse();
		var evalState = new qa.EvalState();
		var answer = qa.ArithmeticEvaluator["eval"](expr,evalState);
		return { question : qa.ArithmeticPrinter.printTex(expr), answer : "" + qa.ArithmeticPrinter.printTex(qa.ArithmeticExpr.EConst(answer)), debug : "<h3>Evaluation steps</h3>" + "<div class='steps eval'>" + evalState.steps.map(qa.ArithmeticPrinter.printEvalStep).join("\n") + "</div>" + Std.string(expr) + "<br/>" + "<div class='tokens'>" + tokens + "</div>" + "<h3>Parsing steps</h3>" + "<div class='steps parser'>" + this.parser.steps.join("<br/>") + "</div>"};
	}
	,__class__: qa.Ksi
};
var test = {};
test.Test = function() {
	haxe.unit.TestCase.call(this);
};
test.Test.__name__ = ["test","Test"];
test.Test.__super__ = haxe.unit.TestCase;
test.Test.prototype = $extend(haxe.unit.TestCase.prototype,{
	testAddZero: function() {
		this.assertEquals("0",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(0,0)),{ fileName : "Test.hx", lineNumber : 7, className : "test.Test", methodName : "testAddZero"});
		this.assertEquals("1",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(0,1)),{ fileName : "Test.hx", lineNumber : 8, className : "test.Test", methodName : "testAddZero"});
		this.assertEquals("2",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(0,2)),{ fileName : "Test.hx", lineNumber : 9, className : "test.Test", methodName : "testAddZero"});
		this.assertEquals("3",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(0,3)),{ fileName : "Test.hx", lineNumber : 10, className : "test.Test", methodName : "testAddZero"});
		this.assertEquals("4",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(0,4)),{ fileName : "Test.hx", lineNumber : 11, className : "test.Test", methodName : "testAddZero"});
		this.assertEquals("5",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(0,5)),{ fileName : "Test.hx", lineNumber : 12, className : "test.Test", methodName : "testAddZero"});
		this.assertEquals("6",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(0,6)),{ fileName : "Test.hx", lineNumber : 13, className : "test.Test", methodName : "testAddZero"});
		this.assertEquals("7",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(0,7)),{ fileName : "Test.hx", lineNumber : 14, className : "test.Test", methodName : "testAddZero"});
		this.assertEquals("8",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(0,8)),{ fileName : "Test.hx", lineNumber : 15, className : "test.Test", methodName : "testAddZero"});
		this.assertEquals("9",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(0,9)),{ fileName : "Test.hx", lineNumber : 16, className : "test.Test", methodName : "testAddZero"});
	}
	,testAddOne: function() {
		this.assertEquals("2",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(1,1)),{ fileName : "Test.hx", lineNumber : 19, className : "test.Test", methodName : "testAddOne"});
		this.assertEquals("3",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(1,2)),{ fileName : "Test.hx", lineNumber : 20, className : "test.Test", methodName : "testAddOne"});
		this.assertEquals("4",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(1,3)),{ fileName : "Test.hx", lineNumber : 21, className : "test.Test", methodName : "testAddOne"});
		this.assertEquals("5",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(1,4)),{ fileName : "Test.hx", lineNumber : 22, className : "test.Test", methodName : "testAddOne"});
		this.assertEquals("6",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(1,5)),{ fileName : "Test.hx", lineNumber : 23, className : "test.Test", methodName : "testAddOne"});
		this.assertEquals("7",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(1,6)),{ fileName : "Test.hx", lineNumber : 24, className : "test.Test", methodName : "testAddOne"});
		this.assertEquals("8",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(1,7)),{ fileName : "Test.hx", lineNumber : 25, className : "test.Test", methodName : "testAddOne"});
		this.assertEquals("9",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(1,8)),{ fileName : "Test.hx", lineNumber : 26, className : "test.Test", methodName : "testAddOne"});
	}
	,testAddCarry: function() {
		this.assertEquals("10",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(9,1)),{ fileName : "Test.hx", lineNumber : 29, className : "test.Test", methodName : "testAddCarry"});
		this.assertEquals("11",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(9,2)),{ fileName : "Test.hx", lineNumber : 30, className : "test.Test", methodName : "testAddCarry"});
		this.assertEquals("12",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(9,3)),{ fileName : "Test.hx", lineNumber : 31, className : "test.Test", methodName : "testAddCarry"});
		this.assertEquals("13",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(9,4)),{ fileName : "Test.hx", lineNumber : 32, className : "test.Test", methodName : "testAddCarry"});
		this.assertEquals("14",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(9,5)),{ fileName : "Test.hx", lineNumber : 33, className : "test.Test", methodName : "testAddCarry"});
		this.assertEquals("15",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(9,6)),{ fileName : "Test.hx", lineNumber : 34, className : "test.Test", methodName : "testAddCarry"});
		this.assertEquals("16",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(9,7)),{ fileName : "Test.hx", lineNumber : 35, className : "test.Test", methodName : "testAddCarry"});
		this.assertEquals("17",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(9,8)),{ fileName : "Test.hx", lineNumber : 36, className : "test.Test", methodName : "testAddCarry"});
		this.assertEquals("18",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(9,9)),{ fileName : "Test.hx", lineNumber : 37, className : "test.Test", methodName : "testAddCarry"});
	}
	,testAddOther: function() {
		this.assertEquals("10",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(0,10)),{ fileName : "Test.hx", lineNumber : 40, className : "test.Test", methodName : "testAddOther"});
		this.assertEquals("11",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(1,10)),{ fileName : "Test.hx", lineNumber : 41, className : "test.Test", methodName : "testAddOther"});
		this.assertEquals("20",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(10,10)),{ fileName : "Test.hx", lineNumber : 42, className : "test.Test", methodName : "testAddOther"});
		this.assertEquals("21",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(10,11)),{ fileName : "Test.hx", lineNumber : 43, className : "test.Test", methodName : "testAddOther"});
		this.assertEquals("30",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(11,19)),{ fileName : "Test.hx", lineNumber : 44, className : "test.Test", methodName : "testAddOther"});
		this.assertEquals("111",qa._Arithmetic.Integer_Impl_.toString(qa._Arithmetic.Integer_Impl_.add(qa._Arithmetic.Integer_Impl_.add(1,10),100)),{ fileName : "Test.hx", lineNumber : 45, className : "test.Test", methodName : "testAddOther"});
	}
	,__class__: test.Test
});
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.prototype.__class__ = String;
String.__name__ = ["String"];
Array.__name__ = ["Array"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
var q = window.jQuery;
js.JQuery = q;
Theme.normal = 4539717;
Theme.disabled = 12566463;
Theme.error = 12298535;
byte._LittleEndianWriter.LittleEndianWriter_Impl_.LN2 = Math.log(2);
hxmath._BigInt.BigInt_Impl_.BITS_PER_CHUNK = 30;
hxmath._BigInt.BigInt_Impl_.CHUNK_MASK = 1073741823;
hxmath._BigInt.BigInt_Impl_.CHUNK_MAX_FLOAT = 1073741824.;
hxmath._BigInt.BigInt_Impl_.MUL_BITS = 15;
hxmath._BigInt.BigInt_Impl_.MUL_MASK = 32767;
hxparse.LexEngine.MAX_CODE = 255;
hxparse.LexEngine.EMPTY = [];
hxparse.LexEngine.ALL_CHARS = [{ min : 0, max : 255}];
qa._Arithmetic.Real_Impl_.ZERO = 0;
qa._Arithmetic.SimpleFraction_Impl_.ZERO = { a : 0, b : 0};
qa._Arithmetic.Integer_Impl_.ZERO = 0;
qa._Arithmetic.Integer_Impl_.ONE = 1;
qa.ArithmeticLexer.tok = hxparse.Lexer.buildRuleset([{ rule : "0x[0-9a-fA-F]+", func : function(lexer) {
	return qa.ArithmeticToken.TConst(qa.Constant.CInteger(qa._Arithmetic.Integer_Impl_.fromString(lexer.current),qa.NumberFormat.Hexadecimal));
}},{ rule : "[0-9]+", func : function(lexer1) {
	return qa.ArithmeticToken.TConst(qa.Constant.CInteger(qa._Arithmetic.Integer_Impl_.fromString(lexer1.current),qa.NumberFormat.Decimal));
}},{ rule : "[0-9]+\\.[0-9]+", func : function(lexer2) {
	return qa.ArithmeticToken.TConst(qa.Constant.CReal(qa._Arithmetic.Real_Impl_.fromString(lexer2.current)));
}},{ rule : "\\.[0-9]+", func : function(lexer3) {
	return qa.ArithmeticToken.TConst(qa.Constant.CReal(qa._Arithmetic.Real_Impl_.fromString(lexer3.current)));
}},{ rule : "[0-9]+[eE][\\+\\-]?[0-9]+", func : function(lexer4) {
	return qa.ArithmeticToken.TConst(qa.Constant.CReal(qa._Arithmetic.Real_Impl_.fromString(lexer4.current)));
}},{ rule : "[0-9]+\\.[0-9]*[eE][\\+\\-]?[0-9]+", func : function(lexer5) {
	return qa.ArithmeticToken.TConst(qa.Constant.CReal(qa._Arithmetic.Real_Impl_.fromString(lexer5.current)));
}},{ rule : "\\(", func : function(lexer6) {
	return qa.ArithmeticToken.TPOpen;
}},{ rule : "\\)", func : function(lexer7) {
	return qa.ArithmeticToken.TPClose;
}},{ rule : "\\+", func : function(lexer8) {
	return qa.ArithmeticToken.TBinop(qa.ArithmeticBinop.OpAdd);
}},{ rule : "\\-", func : function(lexer9) {
	return qa.ArithmeticToken.TBinop(qa.ArithmeticBinop.OpSub);
}},{ rule : "\\*", func : function(lexer10) {
	return qa.ArithmeticToken.TBinop(qa.ArithmeticBinop.OpMul);
}},{ rule : "\\/", func : function(lexer11) {
	return qa.ArithmeticToken.TBinop(qa.ArithmeticBinop.OpDiv);
}},{ rule : "\\^", func : function(lexer12) {
	return qa.ArithmeticToken.TBinop(qa.ArithmeticBinop.OpPow);
}},{ rule : "[\r\n\t ]", func : function(lexer13) {
	return lexer13.token(qa.ArithmeticLexer.tok);
}},{ rule : "", func : function(lexer14) {
	return qa.ArithmeticToken.TEof;
}}],"tok");
qa.ArithmeticLexer.generatedRulesets = [qa.ArithmeticLexer.tok];
Know.main();
})();

//# sourceMappingURL=know.js.map