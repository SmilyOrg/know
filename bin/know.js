(function () { "use strict";
var $hxClasses = {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = ["EReg"];
EReg.prototype = {
	r: null
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,__class__: EReg
};
var HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
};
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
};
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
var IntIterator = function(min,max) {
	this.min = min;
	this.max = max;
};
$hxClasses["IntIterator"] = IntIterator;
IntIterator.__name__ = ["IntIterator"];
IntIterator.prototype = {
	min: null
	,max: null
	,__class__: IntIterator
};
var Theme = function() { };
$hxClasses["Theme"] = Theme;
Theme.__name__ = ["Theme"];
var Know = function() {
	this.ksi = new qa.Ksi();
	this.ksi.onAnswer = $bind(this,this.onAnswer);
	this.ksi.onFinish = $bind(this,this.onFinish);
	this.input = new $("#input");
	this.input.bind("input",$bind(this,this.inputChange));
	this.info = new $("#info");
	this.output = new $("#output");
	this.debug = new $("#debug");
	this.answers = new $("#answers");
	this.output.on("click",".show",function(e) {
		new $(e.target).hide().siblings(".steps, .hide").show();
	});
	this.output.on("click",".hide",function(e1) {
		new $(e1.target).hide().siblings(".steps").hide().siblings(".show").show();
	});
	this.input.val("log(1+x*(e^3-1))/3");
	this.inputChange();
	var runner = new haxe.unit.TestRunner();
	runner.add(new test.TestArithmetic());
	runner.add(new test.TestAlgebra());
	runner.run();
	var tests = new $("#tests");
	tests.text("" + Std.string(runner.result));
	this.setColor(tests,runner.result.success?Theme.disabled:Theme.error);
};
$hxClasses["Know"] = Know;
Know.__name__ = ["Know"];
Know.main = function() {
	new Know();
};
Know.prototype = {
	ksi: null
	,input: null
	,info: null
	,output: null
	,debug: null
	,answers: null
	,inputChange: function(e) {
		var question = this.input.val();
		this.info.text("");
		if(question.length == 0) {
			this.answers.text("");
			return;
		}
		try {
			this.answers.children().addClass("outdated");
			this.ksi.answer(question);
		} catch( e1 ) {
			this.info.text("Error: " + Std.string(e1));
		}
	}
	,onAnswer: function(answer) {
		if(answer.display.provider == null) throw "what" + Std.string(answer.display);
		var result = this.getResultElement(answer.display.provider);
		answer.display.apply(result);
		this.typeset(result);
	}
	,onFinish: function() {
	}
	,getResultElement: function(provider) {
		var name = Type.getClassName(Type.getClass(provider));
		var id = StringTools.replace(new EReg("([a-z])([A-Z])","g").replace(name,"$1-$2"),".","-").toLowerCase();
		var existing = this.answers.children("." + id + ".outdated");
		var result;
		if(existing.length > 0) result = existing.first().removeClass("outdated")[0]; else {
			var element;
			var _this = window.document;
			element = _this.createElement("div");
			element.classList.add(id);
			result = element;
			this.answers.append(result);
		}
		return result;
	}
	,typeset: function(element) {
		MathJax.Hub.Queue(['Typeset',MathJax.Hub,element]);;
	}
	,setColor: function(e,color) {
		e.css({ color : "#" + StringTools.hex(color,6)});
	}
	,__class__: Know
};
var Lambda = function() { };
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = ["Lambda"];
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
};
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
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
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
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
	,__class__: List
};
var IMap = function() { };
$hxClasses["IMap"] = IMap;
IMap.__name__ = ["IMap"];
Math.__name__ = ["Math"];
var Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
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
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.deleteField = function(o,field) {
	if(!Object.prototype.hasOwnProperty.call(o,field)) return false;
	delete(o[field]);
	return true;
};
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
};
var Std = function() { };
$hxClasses["Std"] = Std;
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
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	b: null
	,add: function(x) {
		this.b += Std.string(x);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.htmlEscape = function(s,quotes) {
	s = s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
	if(quotes) return s.split("\"").join("&quot;").split("'").join("&#039;"); else return s;
};
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
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
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { };
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
};
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
};
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
};
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
};
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
};
Type.createInstance = function(cl,args) {
	var _g = args.length;
	switch(_g) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
};
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
};
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
};
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
};
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
};
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c;
		if((v instanceof Array) && v.__enum__ == null) c = Array; else c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2;
		var _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e1 ) {
		return false;
	}
	return true;
};
Type.enumIndex = function(e) {
	return e[1];
};
var WorkerScript = function() {
};
$hxClasses["WorkerScript"] = WorkerScript;
WorkerScript.__name__ = ["WorkerScript"];
WorkerScript["export"] = function(script) {
	self.onmessage = script.onMessage;
};
WorkerScript.prototype = {
	onMessage: function(e) {
	}
	,postMessage: function(m) {
		self.postMessage( m );
	}
	,__class__: WorkerScript
};
var byte = {};
byte._LittleEndianReader = {};
byte._LittleEndianReader.LittleEndianReader_Impl_ = function() { };
$hxClasses["byte._LittleEndianReader.LittleEndianReader_Impl_"] = byte._LittleEndianReader.LittleEndianReader_Impl_;
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
$hxClasses["byte._LittleEndianWriter.LittleEndianWriter_Impl_"] = byte._LittleEndianWriter.LittleEndianWriter_Impl_;
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
$hxClasses["byte.js._ByteData.ByteData_Impl_"] = byte.js._ByteData.ByteData_Impl_;
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
haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","LocalFunction"] };
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.LocalFunction = function(v) { var $x = ["LocalFunction",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.CallStack = function() { };
$hxClasses["haxe.CallStack"] = haxe.CallStack;
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
haxe.Http = function(url) {
	this.url = url;
	this.headers = new List();
	this.params = new List();
	this.async = true;
};
$hxClasses["haxe.Http"] = haxe.Http;
haxe.Http.__name__ = ["haxe","Http"];
haxe.Http.prototype = {
	url: null
	,responseData: null
	,async: null
	,postData: null
	,headers: null
	,params: null
	,req: null
	,cancel: function() {
		if(this.req == null) return;
		this.req.abort();
		this.req = null;
	}
	,request: function(post) {
		var me = this;
		me.responseData = null;
		var r = this.req = js.Browser.createXMLHttpRequest();
		var onreadystatechange = function(_) {
			if(r.readyState != 4) return;
			var s;
			try {
				s = r.status;
			} catch( e ) {
				s = null;
			}
			if(s == undefined) s = null;
			if(s != null) me.onStatus(s);
			if(s != null && s >= 200 && s < 400) {
				me.req = null;
				me.onData(me.responseData = r.responseText);
			} else if(s == null) {
				me.req = null;
				me.onError("Failed to connect or resolve host");
			} else switch(s) {
			case 12029:
				me.req = null;
				me.onError("Failed to connect to host");
				break;
			case 12007:
				me.req = null;
				me.onError("Unknown host");
				break;
			default:
				me.req = null;
				me.responseData = r.responseText;
				me.onError("Http Error #" + r.status);
			}
		};
		if(this.async) r.onreadystatechange = onreadystatechange;
		var uri = this.postData;
		if(uri != null) post = true; else {
			var $it0 = this.params.iterator();
			while( $it0.hasNext() ) {
				var p = $it0.next();
				if(uri == null) uri = ""; else uri += "&";
				uri += encodeURIComponent(p.param) + "=" + encodeURIComponent(p.value);
			}
		}
		try {
			if(post) r.open("POST",this.url,this.async); else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question?"?":"&") + uri,this.async);
				uri = null;
			} else r.open("GET",this.url,this.async);
		} catch( e1 ) {
			me.req = null;
			this.onError(e1.toString());
			return;
		}
		if(!Lambda.exists(this.headers,function(h) {
			return h.header == "Content-Type";
		}) && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var $it1 = this.headers.iterator();
		while( $it1.hasNext() ) {
			var h1 = $it1.next();
			r.setRequestHeader(h1.header,h1.value);
		}
		r.send(uri);
		if(!this.async) onreadystatechange(null);
	}
	,onData: function(data) {
	}
	,onError: function(msg) {
	}
	,onStatus: function(status) {
	}
	,__class__: haxe.Http
};
haxe.Log = function() { };
$hxClasses["haxe.Log"] = haxe.Log;
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
};
haxe.Serializer = function() {
	this.buf = new StringBuf();
	this.cache = new Array();
	this.useCache = haxe.Serializer.USE_CACHE;
	this.useEnumIndex = haxe.Serializer.USE_ENUM_INDEX;
	this.shash = new haxe.ds.StringMap();
	this.scount = 0;
};
$hxClasses["haxe.Serializer"] = haxe.Serializer;
haxe.Serializer.__name__ = ["haxe","Serializer"];
haxe.Serializer.run = function(v) {
	var s = new haxe.Serializer();
	s.serialize(v);
	return s.toString();
};
haxe.Serializer.prototype = {
	buf: null
	,cache: null
	,shash: null
	,scount: null
	,useCache: null
	,useEnumIndex: null
	,toString: function() {
		return this.buf.b;
	}
	,serializeString: function(s) {
		var x = this.shash.get(s);
		if(x != null) {
			this.buf.b += "R";
			if(x == null) this.buf.b += "null"; else this.buf.b += "" + x;
			return;
		}
		this.shash.set(s,this.scount++);
		this.buf.b += "y";
		s = encodeURIComponent(s);
		if(s.length == null) this.buf.b += "null"; else this.buf.b += "" + s.length;
		this.buf.b += ":";
		if(s == null) this.buf.b += "null"; else this.buf.b += "" + s;
	}
	,serializeRef: function(v) {
		var vt = typeof(v);
		var _g1 = 0;
		var _g = this.cache.length;
		while(_g1 < _g) {
			var i = _g1++;
			var ci = this.cache[i];
			if(typeof(ci) == vt && ci == v) {
				this.buf.b += "r";
				if(i == null) this.buf.b += "null"; else this.buf.b += "" + i;
				return true;
			}
		}
		this.cache.push(v);
		return false;
	}
	,serializeFields: function(v) {
		var _g = 0;
		var _g1 = Reflect.fields(v);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			this.serializeString(f);
			this.serialize(Reflect.field(v,f));
		}
		this.buf.b += "g";
	}
	,serialize: function(v) {
		{
			var _g = Type["typeof"](v);
			switch(_g[1]) {
			case 0:
				this.buf.b += "n";
				break;
			case 1:
				var v1 = v;
				if(v1 == 0) {
					this.buf.b += "z";
					return;
				}
				this.buf.b += "i";
				if(v1 == null) this.buf.b += "null"; else this.buf.b += "" + v1;
				break;
			case 2:
				var v2 = v;
				if(Math.isNaN(v2)) this.buf.b += "k"; else if(!Math.isFinite(v2)) if(v2 < 0) this.buf.b += "m"; else this.buf.b += "p"; else {
					this.buf.b += "d";
					if(v2 == null) this.buf.b += "null"; else this.buf.b += "" + v2;
				}
				break;
			case 3:
				if(v) this.buf.b += "t"; else this.buf.b += "f";
				break;
			case 6:
				var c = _g[2];
				if(c == String) {
					this.serializeString(v);
					return;
				}
				if(this.useCache && this.serializeRef(v)) return;
				switch(c) {
				case Array:
					var ucount = 0;
					this.buf.b += "a";
					var l = v.length;
					var _g1 = 0;
					while(_g1 < l) {
						var i = _g1++;
						if(v[i] == null) ucount++; else {
							if(ucount > 0) {
								if(ucount == 1) this.buf.b += "n"; else {
									this.buf.b += "u";
									if(ucount == null) this.buf.b += "null"; else this.buf.b += "" + ucount;
								}
								ucount = 0;
							}
							this.serialize(v[i]);
						}
					}
					if(ucount > 0) {
						if(ucount == 1) this.buf.b += "n"; else {
							this.buf.b += "u";
							if(ucount == null) this.buf.b += "null"; else this.buf.b += "" + ucount;
						}
					}
					this.buf.b += "h";
					break;
				case List:
					this.buf.b += "l";
					var v3 = v;
					var $it0 = v3.iterator();
					while( $it0.hasNext() ) {
						var i1 = $it0.next();
						this.serialize(i1);
					}
					this.buf.b += "h";
					break;
				case Date:
					var d = v;
					this.buf.b += "v";
					this.buf.add(HxOverrides.dateStr(d));
					break;
				case haxe.ds.StringMap:
					this.buf.b += "b";
					var v4 = v;
					var $it1 = v4.keys();
					while( $it1.hasNext() ) {
						var k = $it1.next();
						this.serializeString(k);
						this.serialize(v4.get(k));
					}
					this.buf.b += "h";
					break;
				case haxe.ds.IntMap:
					this.buf.b += "q";
					var v5 = v;
					var $it2 = v5.keys();
					while( $it2.hasNext() ) {
						var k1 = $it2.next();
						this.buf.b += ":";
						if(k1 == null) this.buf.b += "null"; else this.buf.b += "" + k1;
						this.serialize(v5.get(k1));
					}
					this.buf.b += "h";
					break;
				case haxe.ds.ObjectMap:
					this.buf.b += "M";
					var v6 = v;
					var $it3 = v6.keys();
					while( $it3.hasNext() ) {
						var k2 = $it3.next();
						var id = Reflect.field(k2,"__id__");
						Reflect.deleteField(k2,"__id__");
						this.serialize(k2);
						k2.__id__ = id;
						this.serialize(v6.h[k2.__id__]);
					}
					this.buf.b += "h";
					break;
				case haxe.io.Bytes:
					var v7 = v;
					var i2 = 0;
					var max = v7.length - 2;
					var charsBuf = new StringBuf();
					var b64 = haxe.Serializer.BASE64;
					while(i2 < max) {
						var b1 = v7.get(i2++);
						var b2 = v7.get(i2++);
						var b3 = v7.get(i2++);
						charsBuf.add(b64.charAt(b1 >> 2));
						charsBuf.add(b64.charAt((b1 << 4 | b2 >> 4) & 63));
						charsBuf.add(b64.charAt((b2 << 2 | b3 >> 6) & 63));
						charsBuf.add(b64.charAt(b3 & 63));
					}
					if(i2 == max) {
						var b11 = v7.get(i2++);
						var b21 = v7.get(i2++);
						charsBuf.add(b64.charAt(b11 >> 2));
						charsBuf.add(b64.charAt((b11 << 4 | b21 >> 4) & 63));
						charsBuf.add(b64.charAt(b21 << 2 & 63));
					} else if(i2 == max + 1) {
						var b12 = v7.get(i2++);
						charsBuf.add(b64.charAt(b12 >> 2));
						charsBuf.add(b64.charAt(b12 << 4 & 63));
					}
					var chars = charsBuf.b;
					this.buf.b += "s";
					if(chars.length == null) this.buf.b += "null"; else this.buf.b += "" + chars.length;
					this.buf.b += ":";
					if(chars == null) this.buf.b += "null"; else this.buf.b += "" + chars;
					break;
				default:
					if(this.useCache) this.cache.pop();
					if(v.hxSerialize != null) {
						this.buf.b += "C";
						this.serializeString(Type.getClassName(c));
						if(this.useCache) this.cache.push(v);
						v.hxSerialize(this);
						this.buf.b += "g";
					} else {
						this.buf.b += "c";
						this.serializeString(Type.getClassName(c));
						if(this.useCache) this.cache.push(v);
						this.serializeFields(v);
					}
				}
				break;
			case 4:
				if(this.useCache && this.serializeRef(v)) return;
				this.buf.b += "o";
				this.serializeFields(v);
				break;
			case 7:
				var e = _g[2];
				if(this.useCache) {
					if(this.serializeRef(v)) return;
					this.cache.pop();
				}
				if(this.useEnumIndex) this.buf.b += "j"; else this.buf.b += "w";
				this.serializeString(Type.getEnumName(e));
				if(this.useEnumIndex) {
					this.buf.b += ":";
					this.buf.b += Std.string(v[1]);
				} else this.serializeString(v[0]);
				this.buf.b += ":";
				var l1 = v.length;
				this.buf.b += Std.string(l1 - 2);
				var _g11 = 2;
				while(_g11 < l1) {
					var i3 = _g11++;
					this.serialize(v[i3]);
				}
				if(this.useCache) this.cache.push(v);
				break;
			case 5:
				throw "Cannot serialize function";
				break;
			default:
				throw "Cannot serialize " + Std.string(v);
			}
		}
	}
	,__class__: haxe.Serializer
};
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["haxe.Timer"] = haxe.Timer;
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe.Timer.prototype = {
	id: null
	,stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe.Timer
};
haxe.Unserializer = function(buf) {
	this.buf = buf;
	this.length = buf.length;
	this.pos = 0;
	this.scache = new Array();
	this.cache = new Array();
	var r = haxe.Unserializer.DEFAULT_RESOLVER;
	if(r == null) {
		r = Type;
		haxe.Unserializer.DEFAULT_RESOLVER = r;
	}
	this.setResolver(r);
};
$hxClasses["haxe.Unserializer"] = haxe.Unserializer;
haxe.Unserializer.__name__ = ["haxe","Unserializer"];
haxe.Unserializer.initCodes = function() {
	var codes = new Array();
	var _g1 = 0;
	var _g = haxe.Unserializer.BASE64.length;
	while(_g1 < _g) {
		var i = _g1++;
		codes[haxe.Unserializer.BASE64.charCodeAt(i)] = i;
	}
	return codes;
};
haxe.Unserializer.run = function(v) {
	return new haxe.Unserializer(v).unserialize();
};
haxe.Unserializer.prototype = {
	buf: null
	,pos: null
	,length: null
	,cache: null
	,scache: null
	,resolver: null
	,setResolver: function(r) {
		if(r == null) this.resolver = { resolveClass : function(_) {
			return null;
		}, resolveEnum : function(_1) {
			return null;
		}}; else this.resolver = r;
	}
	,get: function(p) {
		return this.buf.charCodeAt(p);
	}
	,readDigits: function() {
		var k = 0;
		var s = false;
		var fpos = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c != c) break;
			if(c == 45) {
				if(this.pos != fpos) break;
				s = true;
				this.pos++;
				continue;
			}
			if(c < 48 || c > 57) break;
			k = k * 10 + (c - 48);
			this.pos++;
		}
		if(s) k *= -1;
		return k;
	}
	,unserializeObject: function(o) {
		while(true) {
			if(this.pos >= this.length) throw "Invalid object";
			if(this.buf.charCodeAt(this.pos) == 103) break;
			var k = this.unserialize();
			if(!(typeof(k) == "string")) throw "Invalid object key";
			var v = this.unserialize();
			o[k] = v;
		}
		this.pos++;
	}
	,unserializeEnum: function(edecl,tag) {
		if(this.get(this.pos++) != 58) throw "Invalid enum format";
		var nargs = this.readDigits();
		if(nargs == 0) return Type.createEnum(edecl,tag);
		var args = new Array();
		while(nargs-- > 0) args.push(this.unserialize());
		return Type.createEnum(edecl,tag,args);
	}
	,unserialize: function() {
		var _g = this.get(this.pos++);
		switch(_g) {
		case 110:
			return null;
		case 116:
			return true;
		case 102:
			return false;
		case 122:
			return 0;
		case 105:
			return this.readDigits();
		case 100:
			var p1 = this.pos;
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
			}
			return Std.parseFloat(HxOverrides.substr(this.buf,p1,this.pos - p1));
		case 121:
			var len = this.readDigits();
			if(this.get(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid string length";
			var s = HxOverrides.substr(this.buf,this.pos,len);
			this.pos += len;
			s = decodeURIComponent(s.split("+").join(" "));
			this.scache.push(s);
			return s;
		case 107:
			return Math.NaN;
		case 109:
			return Math.NEGATIVE_INFINITY;
		case 112:
			return Math.POSITIVE_INFINITY;
		case 97:
			var buf = this.buf;
			var a = new Array();
			this.cache.push(a);
			while(true) {
				var c1 = this.buf.charCodeAt(this.pos);
				if(c1 == 104) {
					this.pos++;
					break;
				}
				if(c1 == 117) {
					this.pos++;
					var n = this.readDigits();
					a[a.length + n - 1] = null;
				} else a.push(this.unserialize());
			}
			return a;
		case 111:
			var o = { };
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 114:
			var n1 = this.readDigits();
			if(n1 < 0 || n1 >= this.cache.length) throw "Invalid reference";
			return this.cache[n1];
		case 82:
			var n2 = this.readDigits();
			if(n2 < 0 || n2 >= this.scache.length) throw "Invalid string reference";
			return this.scache[n2];
		case 120:
			throw this.unserialize();
			break;
		case 99:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o1 = Type.createEmptyInstance(cl);
			this.cache.push(o1);
			this.unserializeObject(o1);
			return o1;
		case 119:
			var name1 = this.unserialize();
			var edecl = this.resolver.resolveEnum(name1);
			if(edecl == null) throw "Enum not found " + name1;
			var e = this.unserializeEnum(edecl,this.unserialize());
			this.cache.push(e);
			return e;
		case 106:
			var name2 = this.unserialize();
			var edecl1 = this.resolver.resolveEnum(name2);
			if(edecl1 == null) throw "Enum not found " + name2;
			this.pos++;
			var index = this.readDigits();
			var tag = Type.getEnumConstructs(edecl1)[index];
			if(tag == null) throw "Unknown enum index " + name2 + "@" + index;
			var e1 = this.unserializeEnum(edecl1,tag);
			this.cache.push(e1);
			return e1;
		case 108:
			var l = new List();
			this.cache.push(l);
			var buf1 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) l.add(this.unserialize());
			this.pos++;
			return l;
		case 98:
			var h = new haxe.ds.StringMap();
			this.cache.push(h);
			var buf2 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s1 = this.unserialize();
				h.set(s1,this.unserialize());
			}
			this.pos++;
			return h;
		case 113:
			var h1 = new haxe.ds.IntMap();
			this.cache.push(h1);
			var buf3 = this.buf;
			var c2 = this.get(this.pos++);
			while(c2 == 58) {
				var i = this.readDigits();
				h1.set(i,this.unserialize());
				c2 = this.get(this.pos++);
			}
			if(c2 != 104) throw "Invalid IntMap format";
			return h1;
		case 77:
			var h2 = new haxe.ds.ObjectMap();
			this.cache.push(h2);
			var buf4 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s2 = this.unserialize();
				h2.set(s2,this.unserialize());
			}
			this.pos++;
			return h2;
		case 118:
			var d;
			var s3 = HxOverrides.substr(this.buf,this.pos,19);
			d = HxOverrides.strDate(s3);
			this.cache.push(d);
			this.pos += 19;
			return d;
		case 115:
			var len1 = this.readDigits();
			var buf5 = this.buf;
			if(this.get(this.pos++) != 58 || this.length - this.pos < len1) throw "Invalid bytes length";
			var codes = haxe.Unserializer.CODES;
			if(codes == null) {
				codes = haxe.Unserializer.initCodes();
				haxe.Unserializer.CODES = codes;
			}
			var i1 = this.pos;
			var rest = len1 & 3;
			var size;
			size = (len1 >> 2) * 3 + (rest >= 2?rest - 1:0);
			var max = i1 + (len1 - rest);
			var bytes = haxe.io.Bytes.alloc(size);
			var bpos = 0;
			while(i1 < max) {
				var c11 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c21 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c11 << 2 | c21 >> 4);
				var c3 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c21 << 4 | c3 >> 2);
				var c4 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c3 << 6 | c4);
			}
			if(rest >= 2) {
				var c12 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c22 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c12 << 2 | c22 >> 4);
				if(rest == 3) {
					var c31 = codes[StringTools.fastCodeAt(buf5,i1++)];
					bytes.set(bpos++,c22 << 4 | c31 >> 2);
				}
			}
			this.pos += len1;
			this.cache.push(bytes);
			return bytes;
		case 67:
			var name3 = this.unserialize();
			var cl1 = this.resolver.resolveClass(name3);
			if(cl1 == null) throw "Class not found " + name3;
			var o2 = Type.createEmptyInstance(cl1);
			this.cache.push(o2);
			o2.hxUnserialize(this);
			if(this.get(this.pos++) != 103) throw "Invalid custom data";
			return o2;
		default:
		}
		this.pos--;
		throw "Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos;
	}
	,__class__: haxe.Unserializer
};
haxe.ds = {};
haxe.ds.GenericCell = function(elt,next) {
	this.elt = elt;
	this.next = next;
};
$hxClasses["haxe.ds.GenericCell"] = haxe.ds.GenericCell;
haxe.ds.GenericCell.__name__ = ["haxe","ds","GenericCell"];
haxe.ds.GenericCell.prototype = {
	elt: null
	,next: null
	,__class__: haxe.ds.GenericCell
};
haxe.ds.GenericStack = function() {
};
$hxClasses["haxe.ds.GenericStack"] = haxe.ds.GenericStack;
haxe.ds.GenericStack.__name__ = ["haxe","ds","GenericStack"];
haxe.ds.GenericStack.prototype = {
	head: null
	,add: function(item) {
		this.head = new haxe.ds.GenericCell(item,this.head);
	}
	,pop: function() {
		var k = this.head;
		if(k == null) return null; else {
			this.head = k.next;
			return k.elt;
		}
	}
	,__class__: haxe.ds.GenericStack
};
haxe.ds.IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe.ds.IntMap;
haxe.ds.IntMap.__name__ = ["haxe","ds","IntMap"];
haxe.ds.IntMap.__interfaces__ = [IMap];
haxe.ds.IntMap.prototype = {
	h: null
	,set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe.ds.IntMap
};
haxe.ds.ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
$hxClasses["haxe.ds.ObjectMap"] = haxe.ds.ObjectMap;
haxe.ds.ObjectMap.__name__ = ["haxe","ds","ObjectMap"];
haxe.ds.ObjectMap.__interfaces__ = [IMap];
haxe.ds.ObjectMap.prototype = {
	h: null
	,set: function(key,value) {
		var id = key.__id__ || (key.__id__ = ++haxe.ds.ObjectMap.count);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe.ds.ObjectMap
};
haxe.ds.StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe.ds.StringMap;
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
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe.ds.StringMap
};
haxe.io = {};
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
$hxClasses["haxe.io.Bytes"] = haxe.io.Bytes;
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
};
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	var i = 0;
	while(i < s.length) {
		var c = StringTools.fastCodeAt(s,i++);
		if(55296 <= c && c <= 56319) c = c - 55232 << 10 | StringTools.fastCodeAt(s,i++) & 1023;
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe.io.Bytes(a.length,a);
};
haxe.io.Bytes.prototype = {
	length: null
	,b: null
	,get: function(pos) {
		return this.b[pos];
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,getString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c21 = b[i++];
				var c3 = b[i++];
				var u = (c & 15) << 18 | (c21 & 127) << 12 | (c3 & 127) << 6 | b[i++] & 127;
				s += fcc((u >> 10) + 55232);
				s += fcc(u & 1023 | 56320);
			}
		}
		return s;
	}
	,toString: function() {
		return this.getString(0,this.length);
	}
	,__class__: haxe.io.Bytes
};
haxe.io.BytesBuffer = function() {
	this.b = new Array();
};
$hxClasses["haxe.io.BytesBuffer"] = haxe.io.BytesBuffer;
haxe.io.BytesBuffer.__name__ = ["haxe","io","BytesBuffer"];
haxe.io.BytesBuffer.prototype = {
	b: null
	,getBytes: function() {
		var bytes = new haxe.io.Bytes(this.b.length,this.b);
		this.b = null;
		return bytes;
	}
	,__class__: haxe.io.BytesBuffer
};
haxe.io.Input = function() { };
$hxClasses["haxe.io.Input"] = haxe.io.Input;
haxe.io.Input.__name__ = ["haxe","io","Input"];
haxe.io.Input.prototype = {
	readByte: function() {
		throw "Not implemented";
	}
	,readBytes: function(s,pos,len) {
		var k = len;
		var b = s.b;
		if(pos < 0 || len < 0 || pos + len > s.length) throw haxe.io.Error.OutsideBounds;
		while(k > 0) {
			b[pos] = this.readByte();
			pos++;
			k--;
		}
		return len;
	}
	,readFullBytes: function(s,pos,len) {
		while(len > 0) {
			var k = this.readBytes(s,pos,len);
			pos += k;
			len -= k;
		}
	}
	,readString: function(len) {
		var b = haxe.io.Bytes.alloc(len);
		this.readFullBytes(b,0,len);
		return b.toString();
	}
	,__class__: haxe.io.Input
};
haxe.io.BytesInput = function(b,pos,len) {
	if(pos == null) pos = 0;
	if(len == null) len = b.length - pos;
	if(pos < 0 || len < 0 || pos + len > b.length) throw haxe.io.Error.OutsideBounds;
	this.b = b.b;
	this.pos = pos;
	this.len = len;
	this.totlen = len;
};
$hxClasses["haxe.io.BytesInput"] = haxe.io.BytesInput;
haxe.io.BytesInput.__name__ = ["haxe","io","BytesInput"];
haxe.io.BytesInput.__super__ = haxe.io.Input;
haxe.io.BytesInput.prototype = $extend(haxe.io.Input.prototype,{
	b: null
	,pos: null
	,len: null
	,totlen: null
	,readByte: function() {
		if(this.len == 0) throw new haxe.io.Eof();
		this.len--;
		return this.b[this.pos++];
	}
	,readBytes: function(buf,pos,len) {
		if(pos < 0 || len < 0 || pos + len > buf.length) throw haxe.io.Error.OutsideBounds;
		if(this.len == 0 && len > 0) throw new haxe.io.Eof();
		if(this.len < len) len = this.len;
		var b1 = this.b;
		var b2 = buf.b;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b2[pos + i] = b1[this.pos + i];
		}
		this.pos += len;
		this.len -= len;
		return len;
	}
	,__class__: haxe.io.BytesInput
});
haxe.io.Output = function() { };
$hxClasses["haxe.io.Output"] = haxe.io.Output;
haxe.io.Output.__name__ = ["haxe","io","Output"];
haxe.io.BytesOutput = function() {
	this.b = new haxe.io.BytesBuffer();
};
$hxClasses["haxe.io.BytesOutput"] = haxe.io.BytesOutput;
haxe.io.BytesOutput.__name__ = ["haxe","io","BytesOutput"];
haxe.io.BytesOutput.__super__ = haxe.io.Output;
haxe.io.BytesOutput.prototype = $extend(haxe.io.Output.prototype,{
	b: null
	,writeByte: function(c) {
		this.b.b.push(c);
	}
	,getBytes: function() {
		return this.b.getBytes();
	}
	,__class__: haxe.io.BytesOutput
});
haxe.io.Eof = function() {
};
$hxClasses["haxe.io.Eof"] = haxe.io.Eof;
haxe.io.Eof.__name__ = ["haxe","io","Eof"];
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
};
haxe.io.Error = $hxClasses["haxe.io.Error"] = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; };
haxe.io.StringInput = function(s) {
	haxe.io.BytesInput.call(this,haxe.io.Bytes.ofString(s));
};
$hxClasses["haxe.io.StringInput"] = haxe.io.StringInput;
haxe.io.StringInput.__name__ = ["haxe","io","StringInput"];
haxe.io.StringInput.__super__ = haxe.io.BytesInput;
haxe.io.StringInput.prototype = $extend(haxe.io.BytesInput.prototype,{
	__class__: haxe.io.StringInput
});
haxe.macro = {};
haxe.macro.Constant = $hxClasses["haxe.macro.Constant"] = { __ename__ : ["haxe","macro","Constant"], __constructs__ : ["CInt","CFloat","CString","CIdent","CRegexp"] };
haxe.macro.Constant.CInt = function(v) { var $x = ["CInt",0,v]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; };
haxe.macro.Constant.CFloat = function(f) { var $x = ["CFloat",1,f]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; };
haxe.macro.Constant.CString = function(s) { var $x = ["CString",2,s]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; };
haxe.macro.Constant.CIdent = function(s) { var $x = ["CIdent",3,s]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; };
haxe.macro.Constant.CRegexp = function(r,opt) { var $x = ["CRegexp",4,r,opt]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; };
haxe.macro.Binop = $hxClasses["haxe.macro.Binop"] = { __ename__ : ["haxe","macro","Binop"], __constructs__ : ["OpAdd","OpMult","OpDiv","OpSub","OpAssign","OpEq","OpNotEq","OpGt","OpGte","OpLt","OpLte","OpAnd","OpOr","OpXor","OpBoolAnd","OpBoolOr","OpShl","OpShr","OpUShr","OpMod","OpAssignOp","OpInterval","OpArrow"] };
haxe.macro.Binop.OpAdd = ["OpAdd",0];
haxe.macro.Binop.OpAdd.toString = $estr;
haxe.macro.Binop.OpAdd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpMult = ["OpMult",1];
haxe.macro.Binop.OpMult.toString = $estr;
haxe.macro.Binop.OpMult.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpDiv = ["OpDiv",2];
haxe.macro.Binop.OpDiv.toString = $estr;
haxe.macro.Binop.OpDiv.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpSub = ["OpSub",3];
haxe.macro.Binop.OpSub.toString = $estr;
haxe.macro.Binop.OpSub.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAssign = ["OpAssign",4];
haxe.macro.Binop.OpAssign.toString = $estr;
haxe.macro.Binop.OpAssign.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpEq = ["OpEq",5];
haxe.macro.Binop.OpEq.toString = $estr;
haxe.macro.Binop.OpEq.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpNotEq = ["OpNotEq",6];
haxe.macro.Binop.OpNotEq.toString = $estr;
haxe.macro.Binop.OpNotEq.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpGt = ["OpGt",7];
haxe.macro.Binop.OpGt.toString = $estr;
haxe.macro.Binop.OpGt.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpGte = ["OpGte",8];
haxe.macro.Binop.OpGte.toString = $estr;
haxe.macro.Binop.OpGte.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpLt = ["OpLt",9];
haxe.macro.Binop.OpLt.toString = $estr;
haxe.macro.Binop.OpLt.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpLte = ["OpLte",10];
haxe.macro.Binop.OpLte.toString = $estr;
haxe.macro.Binop.OpLte.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAnd = ["OpAnd",11];
haxe.macro.Binop.OpAnd.toString = $estr;
haxe.macro.Binop.OpAnd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpOr = ["OpOr",12];
haxe.macro.Binop.OpOr.toString = $estr;
haxe.macro.Binop.OpOr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpXor = ["OpXor",13];
haxe.macro.Binop.OpXor.toString = $estr;
haxe.macro.Binop.OpXor.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpBoolAnd = ["OpBoolAnd",14];
haxe.macro.Binop.OpBoolAnd.toString = $estr;
haxe.macro.Binop.OpBoolAnd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpBoolOr = ["OpBoolOr",15];
haxe.macro.Binop.OpBoolOr.toString = $estr;
haxe.macro.Binop.OpBoolOr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpShl = ["OpShl",16];
haxe.macro.Binop.OpShl.toString = $estr;
haxe.macro.Binop.OpShl.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpShr = ["OpShr",17];
haxe.macro.Binop.OpShr.toString = $estr;
haxe.macro.Binop.OpShr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpUShr = ["OpUShr",18];
haxe.macro.Binop.OpUShr.toString = $estr;
haxe.macro.Binop.OpUShr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpMod = ["OpMod",19];
haxe.macro.Binop.OpMod.toString = $estr;
haxe.macro.Binop.OpMod.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAssignOp = function(op) { var $x = ["OpAssignOp",20,op]; $x.__enum__ = haxe.macro.Binop; $x.toString = $estr; return $x; };
haxe.macro.Binop.OpInterval = ["OpInterval",21];
haxe.macro.Binop.OpInterval.toString = $estr;
haxe.macro.Binop.OpInterval.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpArrow = ["OpArrow",22];
haxe.macro.Binop.OpArrow.toString = $estr;
haxe.macro.Binop.OpArrow.__enum__ = haxe.macro.Binop;
haxe.macro.Unop = $hxClasses["haxe.macro.Unop"] = { __ename__ : ["haxe","macro","Unop"], __constructs__ : ["OpIncrement","OpDecrement","OpNot","OpNeg","OpNegBits"] };
haxe.macro.Unop.OpIncrement = ["OpIncrement",0];
haxe.macro.Unop.OpIncrement.toString = $estr;
haxe.macro.Unop.OpIncrement.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpDecrement = ["OpDecrement",1];
haxe.macro.Unop.OpDecrement.toString = $estr;
haxe.macro.Unop.OpDecrement.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNot = ["OpNot",2];
haxe.macro.Unop.OpNot.toString = $estr;
haxe.macro.Unop.OpNot.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNeg = ["OpNeg",3];
haxe.macro.Unop.OpNeg.toString = $estr;
haxe.macro.Unop.OpNeg.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNegBits = ["OpNegBits",4];
haxe.macro.Unop.OpNegBits.toString = $estr;
haxe.macro.Unop.OpNegBits.__enum__ = haxe.macro.Unop;
haxe.macro.ExprDef = $hxClasses["haxe.macro.ExprDef"] = { __ename__ : ["haxe","macro","ExprDef"], __constructs__ : ["EConst","EArray","EBinop","EField","EParenthesis","EObjectDecl","EArrayDecl","ECall","ENew","EUnop","EVars","EFunction","EBlock","EFor","EIn","EIf","EWhile","ESwitch","ETry","EReturn","EBreak","EContinue","EUntyped","EThrow","ECast","EDisplay","EDisplayNew","ETernary","ECheckType","EMeta"] };
haxe.macro.ExprDef.EConst = function(c) { var $x = ["EConst",0,c]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EArray = function(e1,e2) { var $x = ["EArray",1,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EBinop = function(op,e1,e2) { var $x = ["EBinop",2,op,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EField = function(e,field) { var $x = ["EField",3,e,field]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EParenthesis = function(e) { var $x = ["EParenthesis",4,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EObjectDecl = function(fields) { var $x = ["EObjectDecl",5,fields]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EArrayDecl = function(values) { var $x = ["EArrayDecl",6,values]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.ECall = function(e,params) { var $x = ["ECall",7,e,params]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.ENew = function(t,params) { var $x = ["ENew",8,t,params]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EUnop = function(op,postFix,e) { var $x = ["EUnop",9,op,postFix,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EVars = function(vars) { var $x = ["EVars",10,vars]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EFunction = function(name,f) { var $x = ["EFunction",11,name,f]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EBlock = function(exprs) { var $x = ["EBlock",12,exprs]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EFor = function(it,expr) { var $x = ["EFor",13,it,expr]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EIn = function(e1,e2) { var $x = ["EIn",14,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EIf = function(econd,eif,eelse) { var $x = ["EIf",15,econd,eif,eelse]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EWhile = function(econd,e,normalWhile) { var $x = ["EWhile",16,econd,e,normalWhile]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.ESwitch = function(e,cases,edef) { var $x = ["ESwitch",17,e,cases,edef]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.ETry = function(e,catches) { var $x = ["ETry",18,e,catches]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EReturn = function(e) { var $x = ["EReturn",19,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EBreak = ["EBreak",20];
haxe.macro.ExprDef.EBreak.toString = $estr;
haxe.macro.ExprDef.EBreak.__enum__ = haxe.macro.ExprDef;
haxe.macro.ExprDef.EContinue = ["EContinue",21];
haxe.macro.ExprDef.EContinue.toString = $estr;
haxe.macro.ExprDef.EContinue.__enum__ = haxe.macro.ExprDef;
haxe.macro.ExprDef.EUntyped = function(e) { var $x = ["EUntyped",22,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EThrow = function(e) { var $x = ["EThrow",23,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.ECast = function(e,t) { var $x = ["ECast",24,e,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EDisplay = function(e,isCall) { var $x = ["EDisplay",25,e,isCall]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EDisplayNew = function(t) { var $x = ["EDisplayNew",26,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.ETernary = function(econd,eif,eelse) { var $x = ["ETernary",27,econd,eif,eelse]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.ECheckType = function(e,t) { var $x = ["ECheckType",28,e,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EMeta = function(s,e) { var $x = ["EMeta",29,s,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ComplexType = $hxClasses["haxe.macro.ComplexType"] = { __ename__ : ["haxe","macro","ComplexType"], __constructs__ : ["TPath","TFunction","TAnonymous","TParent","TExtend","TOptional"] };
haxe.macro.ComplexType.TPath = function(p) { var $x = ["TPath",0,p]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; };
haxe.macro.ComplexType.TFunction = function(args,ret) { var $x = ["TFunction",1,args,ret]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; };
haxe.macro.ComplexType.TAnonymous = function(fields) { var $x = ["TAnonymous",2,fields]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; };
haxe.macro.ComplexType.TParent = function(t) { var $x = ["TParent",3,t]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; };
haxe.macro.ComplexType.TExtend = function(p,fields) { var $x = ["TExtend",4,p,fields]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; };
haxe.macro.ComplexType.TOptional = function(t) { var $x = ["TOptional",5,t]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; };
haxe.macro.TypeParam = $hxClasses["haxe.macro.TypeParam"] = { __ename__ : ["haxe","macro","TypeParam"], __constructs__ : ["TPType","TPExpr"] };
haxe.macro.TypeParam.TPType = function(t) { var $x = ["TPType",0,t]; $x.__enum__ = haxe.macro.TypeParam; $x.toString = $estr; return $x; };
haxe.macro.TypeParam.TPExpr = function(e) { var $x = ["TPExpr",1,e]; $x.__enum__ = haxe.macro.TypeParam; $x.toString = $estr; return $x; };
haxe.macro.Access = $hxClasses["haxe.macro.Access"] = { __ename__ : ["haxe","macro","Access"], __constructs__ : ["APublic","APrivate","AStatic","AOverride","ADynamic","AInline","AMacro"] };
haxe.macro.Access.APublic = ["APublic",0];
haxe.macro.Access.APublic.toString = $estr;
haxe.macro.Access.APublic.__enum__ = haxe.macro.Access;
haxe.macro.Access.APrivate = ["APrivate",1];
haxe.macro.Access.APrivate.toString = $estr;
haxe.macro.Access.APrivate.__enum__ = haxe.macro.Access;
haxe.macro.Access.AStatic = ["AStatic",2];
haxe.macro.Access.AStatic.toString = $estr;
haxe.macro.Access.AStatic.__enum__ = haxe.macro.Access;
haxe.macro.Access.AOverride = ["AOverride",3];
haxe.macro.Access.AOverride.toString = $estr;
haxe.macro.Access.AOverride.__enum__ = haxe.macro.Access;
haxe.macro.Access.ADynamic = ["ADynamic",4];
haxe.macro.Access.ADynamic.toString = $estr;
haxe.macro.Access.ADynamic.__enum__ = haxe.macro.Access;
haxe.macro.Access.AInline = ["AInline",5];
haxe.macro.Access.AInline.toString = $estr;
haxe.macro.Access.AInline.__enum__ = haxe.macro.Access;
haxe.macro.Access.AMacro = ["AMacro",6];
haxe.macro.Access.AMacro.toString = $estr;
haxe.macro.Access.AMacro.__enum__ = haxe.macro.Access;
haxe.macro.FieldType = $hxClasses["haxe.macro.FieldType"] = { __ename__ : ["haxe","macro","FieldType"], __constructs__ : ["FVar","FFun","FProp"] };
haxe.macro.FieldType.FVar = function(t,e) { var $x = ["FVar",0,t,e]; $x.__enum__ = haxe.macro.FieldType; $x.toString = $estr; return $x; };
haxe.macro.FieldType.FFun = function(f) { var $x = ["FFun",1,f]; $x.__enum__ = haxe.macro.FieldType; $x.toString = $estr; return $x; };
haxe.macro.FieldType.FProp = function(get,set,t,e) { var $x = ["FProp",2,get,set,t,e]; $x.__enum__ = haxe.macro.FieldType; $x.toString = $estr; return $x; };
haxe.macro.Printer = function(tabString) {
	if(tabString == null) tabString = "\t";
	this.tabs = "";
	this.tabString = tabString;
};
$hxClasses["haxe.macro.Printer"] = haxe.macro.Printer;
haxe.macro.Printer.__name__ = ["haxe","macro","Printer"];
haxe.macro.Printer.prototype = {
	tabs: null
	,tabString: null
	,printUnop: function(op) {
		switch(op[1]) {
		case 0:
			return "++";
		case 1:
			return "--";
		case 2:
			return "!";
		case 3:
			return "-";
		case 4:
			return "~";
		}
	}
	,printBinop: function(op) {
		switch(op[1]) {
		case 0:
			return "+";
		case 1:
			return "*";
		case 2:
			return "/";
		case 3:
			return "-";
		case 4:
			return "=";
		case 5:
			return "==";
		case 6:
			return "!=";
		case 7:
			return ">";
		case 8:
			return ">=";
		case 9:
			return "<";
		case 10:
			return "<=";
		case 11:
			return "&";
		case 12:
			return "|";
		case 13:
			return "^";
		case 14:
			return "&&";
		case 15:
			return "||";
		case 16:
			return "<<";
		case 17:
			return ">>";
		case 18:
			return ">>>";
		case 19:
			return "%";
		case 21:
			return "...";
		case 22:
			return "=>";
		case 20:
			var op1 = op[2];
			return this.printBinop(op1) + "=";
		}
	}
	,printString: function(s) {
		return "\"" + s.split("\n").join("\\n").split("\t").join("\\t").split("'").join("\\'").split("\"").join("\\\"") + "\"";
	}
	,printConstant: function(c) {
		switch(c[1]) {
		case 2:
			var s = c[2];
			return this.printString(s);
		case 3:
			var s1 = c[2];
			return s1;
		case 0:
			var s1 = c[2];
			return s1;
		case 1:
			var s1 = c[2];
			return s1;
		case 4:
			var opt = c[3];
			var s2 = c[2];
			return "~/" + s2 + "/" + opt;
		}
	}
	,printTypeParam: function(param) {
		switch(param[1]) {
		case 0:
			var ct = param[2];
			return this.printComplexType(ct);
		case 1:
			var e = param[2];
			return this.printExpr(e);
		}
	}
	,printTypePath: function(tp) {
		return (tp.pack.length > 0?tp.pack.join(".") + ".":"") + tp.name + (tp.sub != null?"." + tp.sub:"") + (tp.params.length > 0?"<" + tp.params.map($bind(this,this.printTypeParam)).join(", ") + ">":"");
	}
	,printComplexType: function(ct) {
		switch(ct[1]) {
		case 0:
			var tp = ct[2];
			return this.printTypePath(tp);
		case 1:
			var ret = ct[3];
			var args = ct[2];
			return (args.length > 0?args.map($bind(this,this.printComplexType)).join(" -> "):"Void") + " -> " + this.printComplexType(ret);
		case 2:
			var fields = ct[2];
			return "{ " + ((function($this) {
				var $r;
				var _g = [];
				{
					var _g1 = 0;
					while(_g1 < fields.length) {
						var f = fields[_g1];
						++_g1;
						_g.push($this.printField(f) + "; ");
					}
				}
				$r = _g;
				return $r;
			}(this))).join("") + "}";
		case 3:
			var ct1 = ct[2];
			return "(" + this.printComplexType(ct1) + ")";
		case 5:
			var ct2 = ct[2];
			return "?" + this.printComplexType(ct2);
		case 4:
			var fields1 = ct[3];
			var tpl = ct[2];
			return "{> " + tpl.map($bind(this,this.printTypePath)).join(" >, ") + ", " + fields1.map($bind(this,this.printField)).join(", ") + " }";
		}
	}
	,printMetadata: function(meta) {
		return "@" + meta.name + (meta.params.length > 0?"(" + this.printExprs(meta.params,", ") + ")":"");
	}
	,printAccess: function(access) {
		switch(access[1]) {
		case 2:
			return "static";
		case 0:
			return "public";
		case 1:
			return "private";
		case 3:
			return "override";
		case 5:
			return "inline";
		case 4:
			return "dynamic";
		case 6:
			return "macro";
		}
	}
	,printField: function(field) {
		return (field.doc != null && field.doc != ""?"/**\n" + this.tabs + this.tabString + StringTools.replace(field.doc,"\n","\n" + this.tabs + this.tabString) + "\n" + this.tabs + "**/\n" + this.tabs:"") + (field.meta != null && field.meta.length > 0?field.meta.map($bind(this,this.printMetadata)).join("\n" + this.tabs) + ("\n" + this.tabs):"") + (field.access != null && field.access.length > 0?field.access.map($bind(this,this.printAccess)).join(" ") + " ":"") + (function($this) {
			var $r;
			var _g = field.kind;
			$r = (function($this) {
				var $r;
				switch(_g[1]) {
				case 0:
					$r = (function($this) {
						var $r;
						var eo = _g[3];
						var t = _g[2];
						$r = "var " + field.name + $this.opt(t,$bind($this,$this.printComplexType)," : ") + $this.opt(eo,$bind($this,$this.printExpr)," = ");
						return $r;
					}($this));
					break;
				case 2:
					$r = (function($this) {
						var $r;
						var eo1 = _g[5];
						var t1 = _g[4];
						var set = _g[3];
						var get = _g[2];
						$r = "var " + field.name + "(" + get + ", " + set + ")" + $this.opt(t1,$bind($this,$this.printComplexType)," : ") + $this.opt(eo1,$bind($this,$this.printExpr)," = ");
						return $r;
					}($this));
					break;
				case 1:
					$r = (function($this) {
						var $r;
						var func = _g[2];
						$r = "function " + field.name + $this.printFunction(func);
						return $r;
					}($this));
					break;
				}
				return $r;
			}($this));
			return $r;
		}(this));
	}
	,printTypeParamDecl: function(tpd) {
		return tpd.name + (tpd.params != null && tpd.params.length > 0?"<" + tpd.params.map($bind(this,this.printTypeParamDecl)).join(", ") + ">":"") + (tpd.constraints != null && tpd.constraints.length > 0?":(" + tpd.constraints.map($bind(this,this.printComplexType)).join(", ") + ")":"");
	}
	,printFunctionArg: function(arg) {
		return (arg.opt?"?":"") + arg.name + this.opt(arg.type,$bind(this,this.printComplexType),":") + this.opt(arg.value,$bind(this,this.printExpr)," = ");
	}
	,printFunction: function(func) {
		return (func.params.length > 0?"<" + func.params.map($bind(this,this.printTypeParamDecl)).join(", ") + ">":"") + "(" + func.args.map($bind(this,this.printFunctionArg)).join(", ") + ")" + this.opt(func.ret,$bind(this,this.printComplexType),":") + this.opt(func.expr,$bind(this,this.printExpr)," ");
	}
	,printVar: function(v) {
		return v.name + this.opt(v.type,$bind(this,this.printComplexType),":") + this.opt(v.expr,$bind(this,this.printExpr)," = ");
	}
	,printExpr: function(e) {
		var _g1 = this;
		if(e == null) return "#NULL"; else {
			var _g = e.expr;
			switch(_g[1]) {
			case 0:
				var c = _g[2];
				return this.printConstant(c);
			case 1:
				var e2 = _g[3];
				var e1 = _g[2];
				return "" + this.printExpr(e1) + "[" + this.printExpr(e2) + "]";
			case 2:
				var e21 = _g[4];
				var e11 = _g[3];
				var op = _g[2];
				return "" + this.printExpr(e11) + " " + this.printBinop(op) + " " + this.printExpr(e21);
			case 3:
				var n = _g[3];
				var e12 = _g[2];
				return "" + this.printExpr(e12) + "." + n;
			case 4:
				var e13 = _g[2];
				return "(" + this.printExpr(e13) + ")";
			case 5:
				var fl = _g[2];
				return "{ " + fl.map(function(fld) {
					return "" + fld.field + " : " + _g1.printExpr(fld.expr);
				}).join(", ") + " }";
			case 6:
				var el = _g[2];
				return "[" + this.printExprs(el,", ") + "]";
			case 7:
				var el1 = _g[3];
				var e14 = _g[2];
				return "" + this.printExpr(e14) + "(" + this.printExprs(el1,", ") + ")";
			case 8:
				var el2 = _g[3];
				var tp = _g[2];
				return "new " + this.printTypePath(tp) + "(" + this.printExprs(el2,", ") + ")";
			case 9:
				switch(_g[3]) {
				case true:
					var e15 = _g[4];
					var op1 = _g[2];
					return this.printExpr(e15) + this.printUnop(op1);
				case false:
					var e16 = _g[4];
					var op2 = _g[2];
					return this.printUnop(op2) + this.printExpr(e16);
				}
				break;
			case 11:
				var func = _g[3];
				var no = _g[2];
				if(no != null) return "function " + no + this.printFunction(func); else {
					var func1 = _g[3];
					return "function" + this.printFunction(func1);
				}
				break;
			case 10:
				var vl = _g[2];
				return "var " + vl.map($bind(this,this.printVar)).join(", ");
			case 12:
				var el3 = _g[2];
				switch(_g[2].length) {
				case 0:
					return "{ }";
				default:
					var old = this.tabs;
					this.tabs += this.tabString;
					var s = "{\n" + this.tabs + this.printExprs(el3,";\n" + this.tabs);
					this.tabs = old;
					return s + (";\n" + this.tabs + "}");
				}
				break;
			case 13:
				var e22 = _g[3];
				var e17 = _g[2];
				return "for (" + this.printExpr(e17) + ") " + this.printExpr(e22);
			case 14:
				var e23 = _g[3];
				var e18 = _g[2];
				return "" + this.printExpr(e18) + " in " + this.printExpr(e23);
			case 15:
				var eelse = _g[4];
				if(_g[4] == null) {
					var econd = _g[2];
					var eif = _g[3];
					return "if (" + this.printExpr(econd) + ") " + this.printExpr(eif);
				} else switch(_g[4]) {
				default:
					var econd1 = _g[2];
					var eif1 = _g[3];
					return "if (" + this.printExpr(econd1) + ") " + this.printExpr(eif1) + " else " + this.printExpr(eelse);
				}
				break;
			case 16:
				switch(_g[4]) {
				case true:
					var econd2 = _g[2];
					var e19 = _g[3];
					return "while (" + this.printExpr(econd2) + ") " + this.printExpr(e19);
				case false:
					var econd3 = _g[2];
					var e110 = _g[3];
					return "do " + this.printExpr(e110) + " while (" + this.printExpr(econd3) + ")";
				}
				break;
			case 17:
				var edef = _g[4];
				var cl = _g[3];
				var e111 = _g[2];
				var old1 = this.tabs;
				this.tabs += this.tabString;
				var s1 = "switch " + this.printExpr(e111) + " {\n" + this.tabs + cl.map(function(c1) {
					return "case " + _g1.printExprs(c1.values,", ") + (c1.guard != null?" if (" + _g1.printExpr(c1.guard) + "):":":") + (c1.expr != null?_g1.opt(c1.expr,$bind(_g1,_g1.printExpr)) + ";":"");
				}).join("\n" + this.tabs);
				if(edef != null) s1 += "\n" + this.tabs + "default:" + (edef.expr == null?"":this.printExpr(edef) + ";");
				this.tabs = old1;
				return s1 + ("\n" + this.tabs + "}");
			case 18:
				var cl1 = _g[3];
				var e112 = _g[2];
				return "try " + this.printExpr(e112) + cl1.map(function(c2) {
					return " catch(" + c2.name + ":" + _g1.printComplexType(c2.type) + ") " + _g1.printExpr(c2.expr);
				}).join("");
			case 19:
				var eo = _g[2];
				return "return" + this.opt(eo,$bind(this,this.printExpr)," ");
			case 20:
				return "break";
			case 21:
				return "continue";
			case 22:
				var e113 = _g[2];
				return "untyped " + this.printExpr(e113);
			case 23:
				var e114 = _g[2];
				return "throw " + this.printExpr(e114);
			case 24:
				var cto = _g[3];
				var e115 = _g[2];
				if(cto != null) return "cast(" + this.printExpr(e115) + ", " + this.printComplexType(cto) + ")"; else {
					var e116 = _g[2];
					return "cast " + this.printExpr(e116);
				}
				break;
			case 25:
				var e117 = _g[2];
				return "#DISPLAY(" + this.printExpr(e117) + ")";
			case 26:
				var tp1 = _g[2];
				return "#DISPLAY(" + this.printTypePath(tp1) + ")";
			case 27:
				var eelse1 = _g[4];
				var eif2 = _g[3];
				var econd4 = _g[2];
				return "" + this.printExpr(econd4) + " ? " + this.printExpr(eif2) + " : " + this.printExpr(eelse1);
			case 28:
				var ct = _g[3];
				var e118 = _g[2];
				return "(" + this.printExpr(e118) + " : " + this.printComplexType(ct) + ")";
			case 29:
				var e119 = _g[3];
				var meta = _g[2];
				return this.printMetadata(meta) + " " + this.printExpr(e119);
			}
		}
	}
	,printExprs: function(el,sep) {
		return el.map($bind(this,this.printExpr)).join(sep);
	}
	,opt: function(v,f,prefix) {
		if(prefix == null) prefix = "";
		if(v == null) return ""; else return prefix + f(v);
	}
	,__class__: haxe.macro.Printer
};
haxe.unit = {};
haxe.unit.TestCase = function() {
};
$hxClasses["haxe.unit.TestCase"] = haxe.unit.TestCase;
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
$hxClasses["haxe.unit.TestResult"] = haxe.unit.TestResult;
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
$hxClasses["haxe.unit.TestRunner"] = haxe.unit.TestRunner;
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
$hxClasses["haxe.unit.TestStatus"] = haxe.unit.TestStatus;
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
var hscript = {};
hscript.Const = $hxClasses["hscript.Const"] = { __ename__ : ["hscript","Const"], __constructs__ : ["CInt","CFloat","CString"] };
hscript.Const.CInt = function(v) { var $x = ["CInt",0,v]; $x.__enum__ = hscript.Const; $x.toString = $estr; return $x; };
hscript.Const.CFloat = function(f) { var $x = ["CFloat",1,f]; $x.__enum__ = hscript.Const; $x.toString = $estr; return $x; };
hscript.Const.CString = function(s) { var $x = ["CString",2,s]; $x.__enum__ = hscript.Const; $x.toString = $estr; return $x; };
hscript.Expr = $hxClasses["hscript.Expr"] = { __ename__ : ["hscript","Expr"], __constructs__ : ["EConst","EIdent","EVar","EParent","EBlock","EField","EBinop","EUnop","ECall","EIf","EWhile","EFor","EBreak","EContinue","EFunction","EReturn","EArray","EArrayDecl","ENew","EThrow","ETry","EObject","ETernary"] };
hscript.Expr.EConst = function(c) { var $x = ["EConst",0,c]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EIdent = function(v) { var $x = ["EIdent",1,v]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EVar = function(n,t,e) { var $x = ["EVar",2,n,t,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EParent = function(e) { var $x = ["EParent",3,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EBlock = function(e) { var $x = ["EBlock",4,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EField = function(e,f) { var $x = ["EField",5,e,f]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EBinop = function(op,e1,e2) { var $x = ["EBinop",6,op,e1,e2]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EUnop = function(op,prefix,e) { var $x = ["EUnop",7,op,prefix,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.ECall = function(e,params) { var $x = ["ECall",8,e,params]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EIf = function(cond,e1,e2) { var $x = ["EIf",9,cond,e1,e2]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EWhile = function(cond,e) { var $x = ["EWhile",10,cond,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EFor = function(v,it,e) { var $x = ["EFor",11,v,it,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EBreak = ["EBreak",12];
hscript.Expr.EBreak.toString = $estr;
hscript.Expr.EBreak.__enum__ = hscript.Expr;
hscript.Expr.EContinue = ["EContinue",13];
hscript.Expr.EContinue.toString = $estr;
hscript.Expr.EContinue.__enum__ = hscript.Expr;
hscript.Expr.EFunction = function(args,e,name,ret) { var $x = ["EFunction",14,args,e,name,ret]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EReturn = function(e) { var $x = ["EReturn",15,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EArray = function(e,index) { var $x = ["EArray",16,e,index]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EArrayDecl = function(e) { var $x = ["EArrayDecl",17,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.ENew = function(cl,params) { var $x = ["ENew",18,cl,params]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EThrow = function(e) { var $x = ["EThrow",19,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.ETry = function(e,v,t,ecatch) { var $x = ["ETry",20,e,v,t,ecatch]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.EObject = function(fl) { var $x = ["EObject",21,fl]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.Expr.ETernary = function(cond,e1,e2) { var $x = ["ETernary",22,cond,e1,e2]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; };
hscript.CType = $hxClasses["hscript.CType"] = { __ename__ : ["hscript","CType"], __constructs__ : ["CTPath","CTFun","CTAnon","CTParent"] };
hscript.CType.CTPath = function(path,params) { var $x = ["CTPath",0,path,params]; $x.__enum__ = hscript.CType; $x.toString = $estr; return $x; };
hscript.CType.CTFun = function(args,ret) { var $x = ["CTFun",1,args,ret]; $x.__enum__ = hscript.CType; $x.toString = $estr; return $x; };
hscript.CType.CTAnon = function(fields) { var $x = ["CTAnon",2,fields]; $x.__enum__ = hscript.CType; $x.toString = $estr; return $x; };
hscript.CType.CTParent = function(t) { var $x = ["CTParent",3,t]; $x.__enum__ = hscript.CType; $x.toString = $estr; return $x; };
hscript.Error = $hxClasses["hscript.Error"] = { __ename__ : ["hscript","Error"], __constructs__ : ["EInvalidChar","EUnexpected","EUnterminatedString","EUnterminatedComment","EUnknownVariable","EInvalidIterator","EInvalidOp","EInvalidAccess"] };
hscript.Error.EInvalidChar = function(c) { var $x = ["EInvalidChar",0,c]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; };
hscript.Error.EUnexpected = function(s) { var $x = ["EUnexpected",1,s]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; };
hscript.Error.EUnterminatedString = ["EUnterminatedString",2];
hscript.Error.EUnterminatedString.toString = $estr;
hscript.Error.EUnterminatedString.__enum__ = hscript.Error;
hscript.Error.EUnterminatedComment = ["EUnterminatedComment",3];
hscript.Error.EUnterminatedComment.toString = $estr;
hscript.Error.EUnterminatedComment.__enum__ = hscript.Error;
hscript.Error.EUnknownVariable = function(v) { var $x = ["EUnknownVariable",4,v]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; };
hscript.Error.EInvalidIterator = function(v) { var $x = ["EInvalidIterator",5,v]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; };
hscript.Error.EInvalidOp = function(op) { var $x = ["EInvalidOp",6,op]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; };
hscript.Error.EInvalidAccess = function(f) { var $x = ["EInvalidAccess",7,f]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; };
hscript._Interp = {};
hscript._Interp.Stop = $hxClasses["hscript._Interp.Stop"] = { __ename__ : ["hscript","_Interp","Stop"], __constructs__ : ["SBreak","SContinue","SReturn"] };
hscript._Interp.Stop.SBreak = ["SBreak",0];
hscript._Interp.Stop.SBreak.toString = $estr;
hscript._Interp.Stop.SBreak.__enum__ = hscript._Interp.Stop;
hscript._Interp.Stop.SContinue = ["SContinue",1];
hscript._Interp.Stop.SContinue.toString = $estr;
hscript._Interp.Stop.SContinue.__enum__ = hscript._Interp.Stop;
hscript._Interp.Stop.SReturn = function(v) { var $x = ["SReturn",2,v]; $x.__enum__ = hscript._Interp.Stop; $x.toString = $estr; return $x; };
hscript.Interp = function() {
	this.locals = new haxe.ds.StringMap();
	this.variables = new haxe.ds.StringMap();
	this.declared = new Array();
	this.variables.set("null",null);
	this.variables.set("true",true);
	this.variables.set("false",false);
	this.variables.set("trace",function(e) {
		haxe.Log.trace(Std.string(e),{ fileName : "hscript", lineNumber : 0});
	});
	this.initOps();
};
$hxClasses["hscript.Interp"] = hscript.Interp;
hscript.Interp.__name__ = ["hscript","Interp"];
hscript.Interp.prototype = {
	variables: null
	,locals: null
	,binops: null
	,declared: null
	,initOps: function() {
		var me = this;
		this.binops = new haxe.ds.StringMap();
		this.binops.set("+",function(e1,e2) {
			return me.expr(e1) + me.expr(e2);
		});
		this.binops.set("-",function(e11,e21) {
			return me.expr(e11) - me.expr(e21);
		});
		this.binops.set("*",function(e12,e22) {
			return me.expr(e12) * me.expr(e22);
		});
		this.binops.set("/",function(e13,e23) {
			return me.expr(e13) / me.expr(e23);
		});
		this.binops.set("%",function(e14,e24) {
			return me.expr(e14) % me.expr(e24);
		});
		this.binops.set("&",function(e15,e25) {
			return me.expr(e15) & me.expr(e25);
		});
		this.binops.set("|",function(e16,e26) {
			return me.expr(e16) | me.expr(e26);
		});
		this.binops.set("^",function(e17,e27) {
			return me.expr(e17) ^ me.expr(e27);
		});
		this.binops.set("<<",function(e18,e28) {
			return me.expr(e18) << me.expr(e28);
		});
		this.binops.set(">>",function(e19,e29) {
			return me.expr(e19) >> me.expr(e29);
		});
		this.binops.set(">>>",function(e110,e210) {
			return me.expr(e110) >>> me.expr(e210);
		});
		this.binops.set("==",function(e111,e211) {
			return me.expr(e111) == me.expr(e211);
		});
		this.binops.set("!=",function(e112,e212) {
			return me.expr(e112) != me.expr(e212);
		});
		this.binops.set(">=",function(e113,e213) {
			return me.expr(e113) >= me.expr(e213);
		});
		this.binops.set("<=",function(e114,e214) {
			return me.expr(e114) <= me.expr(e214);
		});
		this.binops.set(">",function(e115,e215) {
			return me.expr(e115) > me.expr(e215);
		});
		this.binops.set("<",function(e116,e216) {
			return me.expr(e116) < me.expr(e216);
		});
		this.binops.set("||",function(e117,e217) {
			return me.expr(e117) == true || me.expr(e217) == true;
		});
		this.binops.set("&&",function(e118,e218) {
			return me.expr(e118) == true && me.expr(e218) == true;
		});
		this.binops.set("=",$bind(this,this.assign));
		this.binops.set("...",function(e119,e219) {
			return new IntIterator(me.expr(e119),me.expr(e219));
		});
		this.assignOp("+=",function(v1,v2) {
			return v1 + v2;
		});
		this.assignOp("-=",function(v11,v21) {
			return v11 - v21;
		});
		this.assignOp("*=",function(v12,v22) {
			return v12 * v22;
		});
		this.assignOp("/=",function(v13,v23) {
			return v13 / v23;
		});
		this.assignOp("%=",function(v14,v24) {
			return v14 % v24;
		});
		this.assignOp("&=",function(v15,v25) {
			return v15 & v25;
		});
		this.assignOp("|=",function(v16,v26) {
			return v16 | v26;
		});
		this.assignOp("^=",function(v17,v27) {
			return v17 ^ v27;
		});
		this.assignOp("<<=",function(v18,v28) {
			return v18 << v28;
		});
		this.assignOp(">>=",function(v19,v29) {
			return v19 >> v29;
		});
		this.assignOp(">>>=",function(v110,v210) {
			return v110 >>> v210;
		});
	}
	,assign: function(e1,e2) {
		var v = this.expr(e2);
		switch(e1[1]) {
		case 1:
			var id = e1[2];
			var l = this.locals.get(id);
			if(l == null) this.variables.set(id,v); else l.r = v;
			break;
		case 5:
			var f = e1[3];
			var e = e1[2];
			v = this.set(this.expr(e),f,v);
			break;
		case 16:
			var index = e1[3];
			var e3 = e1[2];
			this.expr(e3)[this.expr(index)] = v;
			break;
		default:
			throw hscript.Error.EInvalidOp("=");
		}
		return v;
	}
	,assignOp: function(op,fop) {
		var me = this;
		this.binops.set(op,function(e1,e2) {
			return me.evalAssignOp(op,fop,e1,e2);
		});
	}
	,evalAssignOp: function(op,fop,e1,e2) {
		var v;
		switch(e1[1]) {
		case 1:
			var id = e1[2];
			var l = this.locals.get(id);
			v = fop(this.expr(e1),this.expr(e2));
			if(l == null) this.variables.set(id,v); else l.r = v;
			break;
		case 5:
			var f = e1[3];
			var e = e1[2];
			var obj = this.expr(e);
			v = fop(this.get(obj,f),this.expr(e2));
			v = this.set(obj,f,v);
			break;
		case 16:
			var index = e1[3];
			var e3 = e1[2];
			var arr = this.expr(e3);
			var index1 = this.expr(index);
			v = fop(arr[index1],this.expr(e2));
			arr[index1] = v;
			break;
		default:
			throw hscript.Error.EInvalidOp(op);
		}
		return v;
	}
	,increment: function(e,prefix,delta) {
		switch(e[1]) {
		case 1:
			var id = e[2];
			var l = this.locals.get(id);
			var v;
			if(l == null) v = this.variables.get(id); else v = l.r;
			if(prefix) {
				v += delta;
				if(l == null) {
					var value = v;
					this.variables.set(id,value);
				} else l.r = v;
			} else if(l == null) {
				var value1 = v + delta;
				this.variables.set(id,value1);
			} else l.r = v + delta;
			return v;
		case 5:
			var f = e[3];
			var e1 = e[2];
			var obj = this.expr(e1);
			var v1 = this.get(obj,f);
			if(prefix) {
				v1 += delta;
				this.set(obj,f,v1);
			} else this.set(obj,f,v1 + delta);
			return v1;
		case 16:
			var index = e[3];
			var e2 = e[2];
			var arr = this.expr(e2);
			var index1 = this.expr(index);
			var v2 = arr[index1];
			if(prefix) {
				v2 += delta;
				arr[index1] = v2;
			} else arr[index1] = v2 + delta;
			return v2;
		default:
			throw hscript.Error.EInvalidOp(delta > 0?"++":"--");
		}
	}
	,execute: function(expr) {
		this.locals = new haxe.ds.StringMap();
		return this.exprReturn(expr);
	}
	,exprReturn: function(e) {
		try {
			return this.expr(e);
		} catch( e1 ) {
			if( js.Boot.__instanceof(e1,hscript._Interp.Stop) ) {
				switch(e1[1]) {
				case 0:
					throw "Invalid break";
					break;
				case 1:
					throw "Invalid continue";
					break;
				case 2:
					var v = e1[2];
					return v;
				}
			} else throw(e1);
		}
		return null;
	}
	,duplicate: function(h) {
		var h2 = new haxe.ds.StringMap();
		var $it0 = h.keys();
		while( $it0.hasNext() ) {
			var k = $it0.next();
			var value = h.get(k);
			h2.set(k,value);
		}
		return h2;
	}
	,restore: function(old) {
		while(this.declared.length > old) {
			var d = this.declared.pop();
			this.locals.set(d.n,d.old);
		}
	}
	,resolve: function(id) {
		var l = this.locals.get(id);
		if(l != null) return l.r;
		var v = this.variables.get(id);
		if(v == null && !this.variables.exists(id)) throw hscript.Error.EUnknownVariable(id);
		return v;
	}
	,expr: function(e) {
		switch(e[1]) {
		case 0:
			var c = e[2];
			switch(c[1]) {
			case 0:
				var v = c[2];
				return v;
			case 1:
				var f = c[2];
				return f;
			case 2:
				var s = c[2];
				return s;
			}
			break;
		case 1:
			var id = e[2];
			return this.resolve(id);
		case 2:
			var e1 = e[4];
			var n = e[2];
			this.declared.push({ n : n, old : this.locals.get(n)});
			var value = { r : e1 == null?null:this.expr(e1)};
			this.locals.set(n,value);
			return null;
		case 3:
			var e2 = e[2];
			return this.expr(e2);
		case 4:
			var exprs = e[2];
			var old = this.declared.length;
			var v1 = null;
			var _g = 0;
			while(_g < exprs.length) {
				var e3 = exprs[_g];
				++_g;
				v1 = this.expr(e3);
			}
			this.restore(old);
			return v1;
		case 5:
			var f1 = e[3];
			var e4 = e[2];
			return this.get(this.expr(e4),f1);
		case 6:
			var e21 = e[4];
			var e11 = e[3];
			var op = e[2];
			var fop = this.binops.get(op);
			if(fop == null) throw hscript.Error.EInvalidOp(op);
			return fop(e11,e21);
		case 7:
			var e5 = e[4];
			var prefix = e[3];
			var op1 = e[2];
			switch(op1) {
			case "!":
				return this.expr(e5) != true;
			case "-":
				return -this.expr(e5);
			case "++":
				return this.increment(e5,prefix,1);
			case "--":
				return this.increment(e5,prefix,-1);
			case "~":
				return ~this.expr(e5);
			default:
				throw hscript.Error.EInvalidOp(op1);
			}
			break;
		case 8:
			var params = e[3];
			var e6 = e[2];
			var args = new Array();
			var _g1 = 0;
			while(_g1 < params.length) {
				var p = params[_g1];
				++_g1;
				args.push(this.expr(p));
			}
			switch(e6[1]) {
			case 5:
				var f2 = e6[3];
				var e7 = e6[2];
				var obj = this.expr(e7);
				if(obj == null) throw hscript.Error.EInvalidAccess(f2);
				return this.fcall(obj,f2,args);
			default:
				return this.call(null,this.expr(e6),args);
			}
			break;
		case 9:
			var e22 = e[4];
			var e12 = e[3];
			var econd = e[2];
			if(this.expr(econd) == true) return this.expr(e12); else if(e22 == null) return null; else return this.expr(e22);
			break;
		case 10:
			var e8 = e[3];
			var econd1 = e[2];
			this.whileLoop(econd1,e8);
			return null;
		case 11:
			var e9 = e[4];
			var it = e[3];
			var v2 = e[2];
			this.forLoop(v2,it,e9);
			return null;
		case 12:
			throw hscript._Interp.Stop.SBreak;
			break;
		case 13:
			throw hscript._Interp.Stop.SContinue;
			break;
		case 15:
			var e10 = e[2];
			throw hscript._Interp.Stop.SReturn(e10 == null?null:this.expr(e10));
			break;
		case 14:
			var name = e[4];
			var fexpr = e[3];
			var params1 = e[2];
			var capturedLocals = this.duplicate(this.locals);
			var me = this;
			var f3 = function(args1) {
				if(args1.length != params1.length) throw "Invalid number of parameters";
				var old1 = me.locals;
				me.locals = me.duplicate(capturedLocals);
				var _g11 = 0;
				var _g2 = params1.length;
				while(_g11 < _g2) {
					var i = _g11++;
					me.locals.set(params1[i].name,{ r : args1[i]});
				}
				var r = null;
				try {
					r = me.exprReturn(fexpr);
				} catch( e13 ) {
					me.locals = old1;
					throw e13;
				}
				me.locals = old1;
				return r;
			};
			var f4 = Reflect.makeVarArgs(f3);
			if(name != null) this.variables.set(name,f4);
			return f4;
		case 17:
			var arr = e[2];
			var a = new Array();
			var _g3 = 0;
			while(_g3 < arr.length) {
				var e14 = arr[_g3];
				++_g3;
				a.push(this.expr(e14));
			}
			return a;
		case 16:
			var index = e[3];
			var e15 = e[2];
			return this.expr(e15)[this.expr(index)];
		case 18:
			var params2 = e[3];
			var cl = e[2];
			var a1 = new Array();
			var _g4 = 0;
			while(_g4 < params2.length) {
				var e16 = params2[_g4];
				++_g4;
				a1.push(this.expr(e16));
			}
			return this.cnew(cl,a1);
		case 19:
			var e17 = e[2];
			throw this.expr(e17);
			break;
		case 20:
			var ecatch = e[5];
			var n1 = e[3];
			var e18 = e[2];
			var old2 = this.declared.length;
			try {
				var v3 = this.expr(e18);
				this.restore(old2);
				return v3;
			} catch( $e0 ) {
				if( js.Boot.__instanceof($e0,hscript._Interp.Stop) ) {
					var err = $e0;
					throw err;
				} else {
				var err1 = $e0;
				this.restore(old2);
				this.declared.push({ n : n1, old : this.locals.get(n1)});
				this.locals.set(n1,{ r : err1});
				var v4 = this.expr(ecatch);
				this.restore(old2);
				return v4;
				}
			}
			break;
		case 21:
			var fl = e[2];
			var o = { };
			var _g5 = 0;
			while(_g5 < fl.length) {
				var f5 = fl[_g5];
				++_g5;
				this.set(o,f5.name,this.expr(f5.e));
			}
			return o;
		case 22:
			var e23 = e[4];
			var e19 = e[3];
			var econd2 = e[2];
			if(this.expr(econd2) == true) return this.expr(e19); else return this.expr(e23);
			break;
		}
		return null;
	}
	,whileLoop: function(econd,e) {
		var old = this.declared.length;
		try {
			while(this.expr(econd) == true) try {
				this.expr(e);
			} catch( err ) {
				if( js.Boot.__instanceof(err,hscript._Interp.Stop) ) {
					switch(err[1]) {
					case 1:
						break;
					case 0:
						throw "__break__";
						break;
					case 2:
						throw err;
						break;
					}
				} else throw(err);
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		this.restore(old);
	}
	,makeIterator: function(v) {
		try {
			v = $iterator(v)();
		} catch( e ) {
		}
		if(v.hasNext == null || v.next == null) throw hscript.Error.EInvalidIterator(v);
		return v;
	}
	,forLoop: function(n,it,e) {
		var old = this.declared.length;
		this.declared.push({ n : n, old : this.locals.get(n)});
		var it1 = this.makeIterator(this.expr(it));
		try {
			while(it1.hasNext()) {
				var value = { r : it1.next()};
				this.locals.set(n,value);
				try {
					this.expr(e);
				} catch( err ) {
					if( js.Boot.__instanceof(err,hscript._Interp.Stop) ) {
						switch(err[1]) {
						case 1:
							break;
						case 0:
							throw "__break__";
							break;
						case 2:
							throw err;
							break;
						}
					} else throw(err);
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		this.restore(old);
	}
	,get: function(o,f) {
		if(o == null) throw hscript.Error.EInvalidAccess(f);
		return Reflect.field(o,f);
	}
	,set: function(o,f,v) {
		if(o == null) throw hscript.Error.EInvalidAccess(f);
		o[f] = v;
		return v;
	}
	,fcall: function(o,f,args) {
		return this.call(o,Reflect.field(o,f),args);
	}
	,call: function(o,f,args) {
		return f.apply(o,args);
	}
	,cnew: function(cl,args) {
		var c = Type.resolveClass(cl);
		if(c == null) c = this.resolve(cl);
		return Type.createInstance(c,args);
	}
	,__class__: hscript.Interp
};
hscript.Macro = function(pos) {
	this.p = pos;
	this.binops = new haxe.ds.StringMap();
	this.unops = new haxe.ds.StringMap();
	var _g = 0;
	var _g1 = Type.getEnumConstructs(haxe.macro.Binop);
	while(_g < _g1.length) {
		var c = _g1[_g];
		++_g;
		if(c == "OpAssignOp") continue;
		var op = Type.createEnum(haxe.macro.Binop,c);
		var assign = false;
		var str;
		switch(op[1]) {
		case 0:
			assign = true;
			str = "+";
			break;
		case 1:
			assign = true;
			str = "*";
			break;
		case 2:
			assign = true;
			str = "/";
			break;
		case 3:
			assign = true;
			str = "-";
			break;
		case 4:
			str = "=";
			break;
		case 5:
			str = "==";
			break;
		case 6:
			str = "!=";
			break;
		case 7:
			str = ">";
			break;
		case 8:
			str = ">=";
			break;
		case 9:
			str = "<";
			break;
		case 10:
			str = "<=";
			break;
		case 11:
			assign = true;
			str = "&";
			break;
		case 12:
			assign = true;
			str = "|";
			break;
		case 13:
			assign = true;
			str = "^";
			break;
		case 14:
			str = "&&";
			break;
		case 15:
			str = "||";
			break;
		case 16:
			assign = true;
			str = "<<";
			break;
		case 17:
			assign = true;
			str = ">>";
			break;
		case 18:
			assign = true;
			str = ">>>";
			break;
		case 19:
			assign = true;
			str = "%";
			break;
		case 20:
			str = "";
			break;
		case 21:
			str = "...";
			break;
		case 22:
			str = "=>";
			break;
		}
		this.binops.set(str,op);
		if(assign) {
			var value = haxe.macro.Binop.OpAssignOp(op);
			this.binops.set(str + "=",value);
		}
	}
	var _g2 = 0;
	var _g11 = Type.getEnumConstructs(haxe.macro.Unop);
	while(_g2 < _g11.length) {
		var c1 = _g11[_g2];
		++_g2;
		var op1 = Type.createEnum(haxe.macro.Unop,c1);
		var str1;
		switch(op1[1]) {
		case 2:
			str1 = "!";
			break;
		case 3:
			str1 = "-";
			break;
		case 4:
			str1 = "~";
			break;
		case 0:
			str1 = "++";
			break;
		case 1:
			str1 = "--";
			break;
		}
		this.unops.set(str1,op1);
	}
};
$hxClasses["hscript.Macro"] = hscript.Macro;
hscript.Macro.__name__ = ["hscript","Macro"];
hscript.Macro.prototype = {
	p: null
	,binops: null
	,unops: null
	,map: function(a,f) {
		var b = new Array();
		var _g = 0;
		while(_g < a.length) {
			var x = a[_g];
			++_g;
			b.push(f(x));
		}
		return b;
	}
	,convertType: function(t) {
		switch(t[1]) {
		case 0:
			var args = t[3];
			var pack = t[2];
			var params = [];
			if(args != null) {
				var _g = 0;
				while(_g < args.length) {
					var t1 = args[_g];
					++_g;
					params.push(haxe.macro.TypeParam.TPType(this.convertType(t1)));
				}
			}
			return haxe.macro.ComplexType.TPath({ pack : pack, name : pack.pop(), params : params, sub : null});
		case 3:
			var t2 = t[2];
			return haxe.macro.ComplexType.TParent(this.convertType(t2));
		case 1:
			var ret = t[3];
			var args1 = t[2];
			return haxe.macro.ComplexType.TFunction(this.map(args1,$bind(this,this.convertType)),this.convertType(ret));
		case 2:
			var fields = t[2];
			var tf = [];
			var _g1 = 0;
			while(_g1 < fields.length) {
				var f = fields[_g1];
				++_g1;
				tf.push({ name : f.name, meta : [], doc : null, access : [], kind : haxe.macro.FieldType.FVar(this.convertType(f.t),null), pos : this.p});
			}
			return haxe.macro.ComplexType.TAnonymous(tf);
		}
	}
	,convert: function(e) {
		return { expr : (function($this) {
			var $r;
			switch(e[1]) {
			case 0:
				$r = (function($this) {
					var $r;
					var c = e[2];
					$r = haxe.macro.ExprDef.EConst((function($this) {
						var $r;
						switch(c[1]) {
						case 0:
							$r = (function($this) {
								var $r;
								var v = c[2];
								$r = haxe.macro.Constant.CInt(v == null?"null":"" + v);
								return $r;
							}($this));
							break;
						case 1:
							$r = (function($this) {
								var $r;
								var f = c[2];
								$r = haxe.macro.Constant.CFloat(f == null?"null":"" + f);
								return $r;
							}($this));
							break;
						case 2:
							$r = (function($this) {
								var $r;
								var s = c[2];
								$r = haxe.macro.Constant.CString(s);
								return $r;
							}($this));
							break;
						}
						return $r;
					}($this)));
					return $r;
				}($this));
				break;
			case 1:
				$r = (function($this) {
					var $r;
					var v1 = e[2];
					$r = haxe.macro.ExprDef.EConst(haxe.macro.Constant.CIdent(v1));
					return $r;
				}($this));
				break;
			case 2:
				$r = (function($this) {
					var $r;
					var e1 = e[4];
					var t = e[3];
					var n = e[2];
					$r = haxe.macro.ExprDef.EVars([{ name : n, expr : e1 == null?null:$this.convert(e1), type : t == null?null:$this.convertType(t)}]);
					return $r;
				}($this));
				break;
			case 3:
				$r = (function($this) {
					var $r;
					var e2 = e[2];
					$r = haxe.macro.ExprDef.EParenthesis($this.convert(e2));
					return $r;
				}($this));
				break;
			case 4:
				$r = (function($this) {
					var $r;
					var el = e[2];
					$r = haxe.macro.ExprDef.EBlock($this.map(el,$bind($this,$this.convert)));
					return $r;
				}($this));
				break;
			case 5:
				$r = (function($this) {
					var $r;
					var f1 = e[3];
					var e3 = e[2];
					$r = haxe.macro.ExprDef.EField($this.convert(e3),f1);
					return $r;
				}($this));
				break;
			case 6:
				$r = (function($this) {
					var $r;
					var e21 = e[4];
					var e11 = e[3];
					var op = e[2];
					$r = (function($this) {
						var $r;
						var b = $this.binops.get(op);
						if(b == null) throw hscript.Error.EInvalidOp(op);
						$r = haxe.macro.ExprDef.EBinop(b,$this.convert(e11),$this.convert(e21));
						return $r;
					}($this));
					return $r;
				}($this));
				break;
			case 7:
				$r = (function($this) {
					var $r;
					var e4 = e[4];
					var prefix = e[3];
					var op1 = e[2];
					$r = (function($this) {
						var $r;
						var u = $this.unops.get(op1);
						if(u == null) throw hscript.Error.EInvalidOp(op1);
						$r = haxe.macro.ExprDef.EUnop(u,!prefix,$this.convert(e4));
						return $r;
					}($this));
					return $r;
				}($this));
				break;
			case 8:
				$r = (function($this) {
					var $r;
					var params = e[3];
					var e5 = e[2];
					$r = haxe.macro.ExprDef.ECall($this.convert(e5),$this.map(params,$bind($this,$this.convert)));
					return $r;
				}($this));
				break;
			case 9:
				$r = (function($this) {
					var $r;
					var e22 = e[4];
					var e12 = e[3];
					var c1 = e[2];
					$r = haxe.macro.ExprDef.EIf($this.convert(c1),$this.convert(e12),e22 == null?null:$this.convert(e22));
					return $r;
				}($this));
				break;
			case 10:
				$r = (function($this) {
					var $r;
					var e6 = e[3];
					var c2 = e[2];
					$r = haxe.macro.ExprDef.EWhile($this.convert(c2),$this.convert(e6),true);
					return $r;
				}($this));
				break;
			case 11:
				$r = (function($this) {
					var $r;
					var efor = e[4];
					var it = e[3];
					var v2 = e[2];
					$r = (function($this) {
						var $r;
						var p = $this.p;
						$r = haxe.macro.ExprDef.EFor({ expr : haxe.macro.ExprDef.EIn({ expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CIdent(v2)), pos : p},$this.convert(it)), pos : p},$this.convert(efor));
						return $r;
					}($this));
					return $r;
				}($this));
				break;
			case 12:
				$r = haxe.macro.ExprDef.EBreak;
				break;
			case 13:
				$r = haxe.macro.ExprDef.EContinue;
				break;
			case 14:
				$r = (function($this) {
					var $r;
					var ret = e[5];
					var name = e[4];
					var e7 = e[3];
					var args = e[2];
					$r = (function($this) {
						var $r;
						var targs = [];
						{
							var _g = 0;
							while(_g < args.length) {
								var a = args[_g];
								++_g;
								targs.push({ name : a.name, type : a.t == null?null:$this.convertType(a.t), opt : false, value : null});
							}
						}
						$r = haxe.macro.ExprDef.EFunction(name,{ params : [], args : targs, expr : $this.convert(e7), ret : ret == null?null:$this.convertType(ret)});
						return $r;
					}($this));
					return $r;
				}($this));
				break;
			case 15:
				$r = (function($this) {
					var $r;
					var e8 = e[2];
					$r = haxe.macro.ExprDef.EReturn(e8 == null?null:$this.convert(e8));
					return $r;
				}($this));
				break;
			case 16:
				$r = (function($this) {
					var $r;
					var index = e[3];
					var e9 = e[2];
					$r = haxe.macro.ExprDef.EArray($this.convert(e9),$this.convert(index));
					return $r;
				}($this));
				break;
			case 17:
				$r = (function($this) {
					var $r;
					var el1 = e[2];
					$r = haxe.macro.ExprDef.EArrayDecl($this.map(el1,$bind($this,$this.convert)));
					return $r;
				}($this));
				break;
			case 18:
				$r = (function($this) {
					var $r;
					var params1 = e[3];
					var cl = e[2];
					$r = (function($this) {
						var $r;
						var pack = cl.split(".");
						$r = haxe.macro.ExprDef.ENew({ pack : pack, name : pack.pop(), params : [], sub : null},$this.map(params1,$bind($this,$this.convert)));
						return $r;
					}($this));
					return $r;
				}($this));
				break;
			case 19:
				$r = (function($this) {
					var $r;
					var e10 = e[2];
					$r = haxe.macro.ExprDef.EThrow($this.convert(e10));
					return $r;
				}($this));
				break;
			case 20:
				$r = (function($this) {
					var $r;
					var ec = e[5];
					var t1 = e[4];
					var v3 = e[3];
					var e13 = e[2];
					$r = haxe.macro.ExprDef.ETry($this.convert(e13),[{ type : $this.convertType(t1), name : v3, expr : $this.convert(ec)}]);
					return $r;
				}($this));
				break;
			case 21:
				$r = (function($this) {
					var $r;
					var fields = e[2];
					$r = (function($this) {
						var $r;
						var tf = [];
						{
							var _g1 = 0;
							while(_g1 < fields.length) {
								var f2 = fields[_g1];
								++_g1;
								tf.push({ field : f2.name, expr : $this.convert(f2.e)});
							}
						}
						$r = haxe.macro.ExprDef.EObjectDecl(tf);
						return $r;
					}($this));
					return $r;
				}($this));
				break;
			case 22:
				$r = (function($this) {
					var $r;
					var e23 = e[4];
					var e14 = e[3];
					var cond = e[2];
					$r = haxe.macro.ExprDef.ETernary($this.convert(cond),$this.convert(e14),$this.convert(e23));
					return $r;
				}($this));
				break;
			}
			return $r;
		}(this)), pos : this.p};
	}
	,__class__: hscript.Macro
};
hscript.Token = $hxClasses["hscript.Token"] = { __ename__ : ["hscript","Token"], __constructs__ : ["TEof","TConst","TId","TOp","TPOpen","TPClose","TBrOpen","TBrClose","TDot","TComma","TSemicolon","TBkOpen","TBkClose","TQuestion","TDoubleDot"] };
hscript.Token.TEof = ["TEof",0];
hscript.Token.TEof.toString = $estr;
hscript.Token.TEof.__enum__ = hscript.Token;
hscript.Token.TConst = function(c) { var $x = ["TConst",1,c]; $x.__enum__ = hscript.Token; $x.toString = $estr; return $x; };
hscript.Token.TId = function(s) { var $x = ["TId",2,s]; $x.__enum__ = hscript.Token; $x.toString = $estr; return $x; };
hscript.Token.TOp = function(s) { var $x = ["TOp",3,s]; $x.__enum__ = hscript.Token; $x.toString = $estr; return $x; };
hscript.Token.TPOpen = ["TPOpen",4];
hscript.Token.TPOpen.toString = $estr;
hscript.Token.TPOpen.__enum__ = hscript.Token;
hscript.Token.TPClose = ["TPClose",5];
hscript.Token.TPClose.toString = $estr;
hscript.Token.TPClose.__enum__ = hscript.Token;
hscript.Token.TBrOpen = ["TBrOpen",6];
hscript.Token.TBrOpen.toString = $estr;
hscript.Token.TBrOpen.__enum__ = hscript.Token;
hscript.Token.TBrClose = ["TBrClose",7];
hscript.Token.TBrClose.toString = $estr;
hscript.Token.TBrClose.__enum__ = hscript.Token;
hscript.Token.TDot = ["TDot",8];
hscript.Token.TDot.toString = $estr;
hscript.Token.TDot.__enum__ = hscript.Token;
hscript.Token.TComma = ["TComma",9];
hscript.Token.TComma.toString = $estr;
hscript.Token.TComma.__enum__ = hscript.Token;
hscript.Token.TSemicolon = ["TSemicolon",10];
hscript.Token.TSemicolon.toString = $estr;
hscript.Token.TSemicolon.__enum__ = hscript.Token;
hscript.Token.TBkOpen = ["TBkOpen",11];
hscript.Token.TBkOpen.toString = $estr;
hscript.Token.TBkOpen.__enum__ = hscript.Token;
hscript.Token.TBkClose = ["TBkClose",12];
hscript.Token.TBkClose.toString = $estr;
hscript.Token.TBkClose.__enum__ = hscript.Token;
hscript.Token.TQuestion = ["TQuestion",13];
hscript.Token.TQuestion.toString = $estr;
hscript.Token.TQuestion.__enum__ = hscript.Token;
hscript.Token.TDoubleDot = ["TDoubleDot",14];
hscript.Token.TDoubleDot.toString = $estr;
hscript.Token.TDoubleDot.__enum__ = hscript.Token;
hscript.Parser = function() {
	this.line = 1;
	this.opChars = "+*/-=!><&|^%~";
	this.identChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
	var priorities = [["%"],["*","/"],["+","-"],["<<",">>",">>>"],["|","&","^"],["==","!=",">","<",">=","<="],["..."],["&&"],["||"],["=","+=","-=","*=","/=","%=","<<=",">>=",">>>=","|=","&=","^="]];
	this.opPriority = new haxe.ds.StringMap();
	this.opRightAssoc = new haxe.ds.StringMap();
	this.unops = new haxe.ds.StringMap();
	var _g1 = 0;
	var _g = priorities.length;
	while(_g1 < _g) {
		var i = _g1++;
		var _g2 = 0;
		var _g3 = priorities[i];
		while(_g2 < _g3.length) {
			var x = _g3[_g2];
			++_g2;
			this.opPriority.set(x,i);
			if(i == 9) this.opRightAssoc.set(x,true);
		}
	}
	var _g4 = 0;
	var _g11 = ["!","++","--","-","~"];
	while(_g4 < _g11.length) {
		var x1 = _g11[_g4];
		++_g4;
		this.unops.set(x1,x1 == "++" || x1 == "--");
	}
};
$hxClasses["hscript.Parser"] = hscript.Parser;
hscript.Parser.__name__ = ["hscript","Parser"];
hscript.Parser.prototype = {
	line: null
	,opChars: null
	,identChars: null
	,opPriority: null
	,opRightAssoc: null
	,unops: null
	,allowJSON: null
	,allowTypes: null
	,input: null
	,'char': null
	,ops: null
	,idents: null
	,tokens: null
	,error: function(err,pmin,pmax) {
		throw err;
	}
	,invalidChar: function(c) {
		this.error(hscript.Error.EInvalidChar(c),0,0);
	}
	,parseString: function(s) {
		this.line = 1;
		return this.parse(new haxe.io.StringInput(s));
	}
	,parse: function(s) {
		this.tokens = new haxe.ds.GenericStack();
		this["char"] = -1;
		this.input = s;
		this.ops = new Array();
		this.idents = new Array();
		var _g1 = 0;
		var _g = this.opChars.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.ops[HxOverrides.cca(this.opChars,i)] = true;
		}
		var _g11 = 0;
		var _g2 = this.identChars.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			this.idents[HxOverrides.cca(this.identChars,i1)] = true;
		}
		var a = new Array();
		while(true) {
			var tk = this.token();
			if(tk == hscript.Token.TEof) break;
			this.tokens.add(tk);
			a.push(this.parseFullExpr());
		}
		if(a.length == 1) return a[0]; else return this.mk(hscript.Expr.EBlock(a),0,null);
	}
	,unexpected: function(tk) {
		this.error(hscript.Error.EUnexpected(this.tokenString(tk)),0,0);
		return null;
	}
	,push: function(tk) {
		this.tokens.add(tk);
	}
	,ensure: function(tk) {
		var t = this.token();
		if(t != tk) this.unexpected(t);
	}
	,expr: function(e) {
		return e;
	}
	,pmin: function(e) {
		return 0;
	}
	,pmax: function(e) {
		return 0;
	}
	,mk: function(e,pmin,pmax) {
		return e;
	}
	,isBlock: function(e) {
		switch(e[1]) {
		case 4:case 21:
			return true;
		case 14:
			var e1 = e[3];
			return this.isBlock(e1);
		case 2:
			var e2 = e[4];
			return e2 != null && this.isBlock(e2);
		case 9:
			var e21 = e[4];
			var e11 = e[3];
			if(e21 != null) return this.isBlock(e21); else return this.isBlock(e11);
			break;
		case 6:
			var e3 = e[4];
			return this.isBlock(e3);
		case 7:
			var e4 = e[4];
			var prefix = e[3];
			return !prefix && this.isBlock(e4);
		case 10:
			var e5 = e[3];
			return this.isBlock(e5);
		case 11:
			var e6 = e[4];
			return this.isBlock(e6);
		case 15:
			var e7 = e[2];
			return e7 != null && this.isBlock(e7);
		default:
			return false;
		}
	}
	,parseFullExpr: function() {
		var e = this.parseExpr();
		var tk = this.token();
		if(tk != hscript.Token.TSemicolon && tk != hscript.Token.TEof) {
			if(this.isBlock(e)) this.tokens.add(tk); else this.unexpected(tk);
		}
		return e;
	}
	,parseObject: function(p1) {
		var fl = new Array();
		try {
			while(true) {
				var tk = this.token();
				var id = null;
				switch(tk[1]) {
				case 2:
					var i = tk[2];
					id = i;
					break;
				case 1:
					var c = tk[2];
					if(!this.allowJSON) this.unexpected(tk);
					switch(c[1]) {
					case 2:
						var s = c[2];
						id = s;
						break;
					default:
						this.unexpected(tk);
					}
					break;
				case 7:
					throw "__break__";
					break;
				default:
					this.unexpected(tk);
				}
				this.ensure(hscript.Token.TDoubleDot);
				fl.push({ name : id, e : this.parseExpr()});
				tk = this.token();
				switch(tk[1]) {
				case 7:
					throw "__break__";
					break;
				case 9:
					break;
				default:
					this.unexpected(tk);
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		return this.parseExprNext(this.mk(hscript.Expr.EObject(fl),p1,null));
	}
	,parseExpr: function() {
		var tk = this.token();
		switch(tk[1]) {
		case 2:
			var id = tk[2];
			var e = this.parseStructure(id);
			if(e == null) e = this.mk(hscript.Expr.EIdent(id),null,null);
			return this.parseExprNext(e);
		case 1:
			var c = tk[2];
			return this.parseExprNext(this.mk(hscript.Expr.EConst(c),null,null));
		case 4:
			var e1 = this.parseExpr();
			this.ensure(hscript.Token.TPClose);
			return this.parseExprNext(this.mk(hscript.Expr.EParent(e1),0,0));
		case 6:
			tk = this.token();
			switch(tk[1]) {
			case 7:
				return this.parseExprNext(this.mk(hscript.Expr.EObject([]),0,null));
			case 2:
				var tk2 = this.token();
				this.tokens.add(tk2);
				this.tokens.add(tk);
				switch(tk2[1]) {
				case 14:
					return this.parseExprNext(this.parseObject(0));
				default:
				}
				break;
			case 1:
				var c1 = tk[2];
				if(this.allowJSON) switch(c1[1]) {
				case 2:
					var tk21 = this.token();
					this.tokens.add(tk21);
					this.tokens.add(tk);
					switch(tk21[1]) {
					case 14:
						return this.parseExprNext(this.parseObject(0));
					default:
					}
					break;
				default:
					this.tokens.add(tk);
				} else this.tokens.add(tk);
				break;
			default:
				this.tokens.add(tk);
			}
			var a = new Array();
			while(true) {
				a.push(this.parseFullExpr());
				tk = this.token();
				if(tk == hscript.Token.TBrClose) break;
				this.tokens.add(tk);
			}
			return this.mk(hscript.Expr.EBlock(a),0,null);
		case 3:
			var op = tk[2];
			if(this.unops.exists(op)) return this.makeUnop(op,this.parseExpr());
			return this.unexpected(tk);
		case 11:
			var a1 = new Array();
			tk = this.token();
			while(tk != hscript.Token.TBkClose) {
				this.tokens.add(tk);
				a1.push(this.parseExpr());
				tk = this.token();
				if(tk == hscript.Token.TComma) tk = this.token();
			}
			return this.parseExprNext(this.mk(hscript.Expr.EArrayDecl(a1),0,null));
		default:
			return this.unexpected(tk);
		}
	}
	,makeUnop: function(op,e) {
		switch(e[1]) {
		case 6:
			var e2 = e[4];
			var e1 = e[3];
			var bop = e[2];
			return this.mk(hscript.Expr.EBinop(bop,this.makeUnop(op,e1),e2),0,0);
		case 22:
			var e3 = e[4];
			var e21 = e[3];
			var e11 = e[2];
			return this.mk(hscript.Expr.ETernary(this.makeUnop(op,e11),e21,e3),0,0);
		default:
			return this.mk(hscript.Expr.EUnop(op,true,e),0,0);
		}
	}
	,makeBinop: function(op,e1,e) {
		switch(e[1]) {
		case 6:
			var e3 = e[4];
			var e2 = e[3];
			var op2 = e[2];
			if(this.opPriority.get(op) <= this.opPriority.get(op2) && !this.opRightAssoc.exists(op)) return this.mk(hscript.Expr.EBinop(op2,this.makeBinop(op,e1,e2),e3),0,0); else return this.mk(hscript.Expr.EBinop(op,e1,e),0,0);
			break;
		case 22:
			var e4 = e[4];
			var e31 = e[3];
			var e21 = e[2];
			if(this.opRightAssoc.exists(op)) return this.mk(hscript.Expr.EBinop(op,e1,e),0,0); else return this.mk(hscript.Expr.ETernary(this.makeBinop(op,e1,e21),e31,e4),0,0);
			break;
		default:
			return this.mk(hscript.Expr.EBinop(op,e1,e),0,0);
		}
	}
	,parseStructure: function(id) {
		switch(id) {
		case "if":
			var cond = this.parseExpr();
			var e1 = this.parseExpr();
			var e2 = null;
			var semic = false;
			var tk = this.token();
			if(tk == hscript.Token.TSemicolon) {
				semic = true;
				tk = this.token();
			}
			if(Type.enumEq(tk,hscript.Token.TId("else"))) e2 = this.parseExpr(); else {
				this.tokens.add(tk);
				if(semic) this.tokens.add(hscript.Token.TSemicolon);
			}
			return this.mk(hscript.Expr.EIf(cond,e1,e2),0,e2 == null?0:0);
		case "var":
			var tk1 = this.token();
			var ident = null;
			switch(tk1[1]) {
			case 2:
				var id1 = tk1[2];
				ident = id1;
				break;
			default:
				this.unexpected(tk1);
			}
			tk1 = this.token();
			var t = null;
			if(tk1 == hscript.Token.TDoubleDot && this.allowTypes) {
				t = this.parseType();
				tk1 = this.token();
			}
			var e = null;
			if(Type.enumEq(tk1,hscript.Token.TOp("="))) e = this.parseExpr(); else this.tokens.add(tk1);
			return this.mk(hscript.Expr.EVar(ident,t,e),0,e == null?0:0);
		case "while":
			var econd = this.parseExpr();
			var e3 = this.parseExpr();
			return this.mk(hscript.Expr.EWhile(econd,e3),0,0);
		case "for":
			this.ensure(hscript.Token.TPOpen);
			var tk2 = this.token();
			var vname = null;
			switch(tk2[1]) {
			case 2:
				var id2 = tk2[2];
				vname = id2;
				break;
			default:
				this.unexpected(tk2);
			}
			tk2 = this.token();
			if(!Type.enumEq(tk2,hscript.Token.TId("in"))) this.unexpected(tk2);
			var eiter = this.parseExpr();
			this.ensure(hscript.Token.TPClose);
			var e4 = this.parseExpr();
			return this.mk(hscript.Expr.EFor(vname,eiter,e4),0,0);
		case "break":
			return hscript.Expr.EBreak;
		case "continue":
			return hscript.Expr.EContinue;
		case "else":
			return this.unexpected(hscript.Token.TId(id));
		case "function":
			var tk3 = this.token();
			var name = null;
			switch(tk3[1]) {
			case 2:
				var id3 = tk3[2];
				name = id3;
				break;
			default:
				this.tokens.add(tk3);
			}
			this.ensure(hscript.Token.TPOpen);
			var args = new Array();
			tk3 = this.token();
			if(tk3 != hscript.Token.TPClose) {
				var arg = true;
				while(arg) {
					var name1 = null;
					switch(tk3[1]) {
					case 2:
						var id4 = tk3[2];
						name1 = id4;
						break;
					default:
						this.unexpected(tk3);
					}
					tk3 = this.token();
					var t1 = null;
					if(tk3 == hscript.Token.TDoubleDot && this.allowTypes) {
						t1 = this.parseType();
						tk3 = this.token();
					}
					args.push({ name : name1, t : t1});
					switch(tk3[1]) {
					case 9:
						tk3 = this.token();
						break;
					case 5:
						arg = false;
						break;
					default:
						this.unexpected(tk3);
					}
				}
			}
			var ret = null;
			if(this.allowTypes) {
				tk3 = this.token();
				if(tk3 != hscript.Token.TDoubleDot) this.tokens.add(tk3); else ret = this.parseType();
			}
			var body = this.parseExpr();
			return this.mk(hscript.Expr.EFunction(args,body,name,ret),0,0);
		case "return":
			var tk4 = this.token();
			this.tokens.add(tk4);
			var e5;
			if(tk4 == hscript.Token.TSemicolon) e5 = null; else e5 = this.parseExpr();
			return this.mk(hscript.Expr.EReturn(e5),0,e5 == null?0:0);
		case "new":
			var a = new Array();
			var tk5 = this.token();
			switch(tk5[1]) {
			case 2:
				var id5 = tk5[2];
				a.push(id5);
				break;
			default:
				this.unexpected(tk5);
			}
			var next = true;
			while(next) {
				tk5 = this.token();
				switch(tk5[1]) {
				case 8:
					tk5 = this.token();
					switch(tk5[1]) {
					case 2:
						var id6 = tk5[2];
						a.push(id6);
						break;
					default:
						this.unexpected(tk5);
					}
					break;
				case 4:
					next = false;
					break;
				default:
					this.unexpected(tk5);
				}
			}
			var args1 = this.parseExprList(hscript.Token.TPClose);
			return this.mk(hscript.Expr.ENew(a.join("."),args1),0,null);
		case "throw":
			var e6 = this.parseExpr();
			return this.mk(hscript.Expr.EThrow(e6),0,0);
		case "try":
			var e7 = this.parseExpr();
			var tk6 = this.token();
			if(!Type.enumEq(tk6,hscript.Token.TId("catch"))) this.unexpected(tk6);
			this.ensure(hscript.Token.TPOpen);
			tk6 = this.token();
			var vname1;
			switch(tk6[1]) {
			case 2:
				var id7 = tk6[2];
				vname1 = id7;
				break;
			default:
				vname1 = this.unexpected(tk6);
			}
			this.ensure(hscript.Token.TDoubleDot);
			var t2 = null;
			if(this.allowTypes) t2 = this.parseType(); else {
				tk6 = this.token();
				if(!Type.enumEq(tk6,hscript.Token.TId("Dynamic"))) this.unexpected(tk6);
			}
			this.ensure(hscript.Token.TPClose);
			var ec = this.parseExpr();
			return this.mk(hscript.Expr.ETry(e7,vname1,t2,ec),0,0);
		default:
			return null;
		}
	}
	,parseExprNext: function(e1) {
		var tk = this.token();
		switch(tk[1]) {
		case 3:
			var op = tk[2];
			if(this.unops.get(op)) {
				if(this.isBlock(e1) || (function($this) {
					var $r;
					switch(e1[1]) {
					case 3:
						$r = true;
						break;
					default:
						$r = false;
					}
					return $r;
				}(this))) {
					this.tokens.add(tk);
					return e1;
				}
				return this.parseExprNext(this.mk(hscript.Expr.EUnop(op,false,e1),0,null));
			}
			return this.makeBinop(op,e1,this.parseExpr());
		case 8:
			tk = this.token();
			var field = null;
			switch(tk[1]) {
			case 2:
				var id = tk[2];
				field = id;
				break;
			default:
				this.unexpected(tk);
			}
			return this.parseExprNext(this.mk(hscript.Expr.EField(e1,field),0,null));
		case 4:
			return this.parseExprNext(this.mk(hscript.Expr.ECall(e1,this.parseExprList(hscript.Token.TPClose)),0,null));
		case 11:
			var e2 = this.parseExpr();
			this.ensure(hscript.Token.TBkClose);
			return this.parseExprNext(this.mk(hscript.Expr.EArray(e1,e2),0,null));
		case 13:
			var e21 = this.parseExpr();
			this.ensure(hscript.Token.TDoubleDot);
			var e3 = this.parseExpr();
			return this.mk(hscript.Expr.ETernary(e1,e21,e3),0,0);
		default:
			this.tokens.add(tk);
			return e1;
		}
	}
	,parseType: function() {
		var t = this.token();
		switch(t[1]) {
		case 2:
			var v = t[2];
			var path = [v];
			while(true) {
				t = this.token();
				if(t != hscript.Token.TDot) break;
				t = this.token();
				switch(t[1]) {
				case 2:
					var v1 = t[2];
					path.push(v1);
					break;
				default:
					this.unexpected(t);
				}
			}
			var params = null;
			switch(t[1]) {
			case 3:
				var op = t[2];
				if(op == "<") {
					params = [];
					try {
						while(true) {
							params.push(this.parseType());
							t = this.token();
							switch(t[1]) {
							case 9:
								continue;
								break;
							case 3:
								var op1 = t[2];
								if(op1 == ">") throw "__break__";
								break;
							default:
							}
							this.unexpected(t);
						}
					} catch( e ) { if( e != "__break__" ) throw e; }
				}
				break;
			default:
				this.tokens.add(t);
			}
			return this.parseTypeNext(hscript.CType.CTPath(path,params));
		case 4:
			var t1 = this.parseType();
			this.ensure(hscript.Token.TPClose);
			return this.parseTypeNext(hscript.CType.CTParent(t1));
		case 6:
			var fields = [];
			try {
				while(true) {
					t = this.token();
					switch(t[1]) {
					case 7:
						throw "__break__";
						break;
					case 2:
						var name = t[2];
						this.ensure(hscript.Token.TDoubleDot);
						fields.push({ name : name, t : this.parseType()});
						t = this.token();
						switch(t[1]) {
						case 9:
							break;
						case 7:
							throw "__break__";
							break;
						default:
							this.unexpected(t);
						}
						break;
					default:
						this.unexpected(t);
					}
				}
			} catch( e ) { if( e != "__break__" ) throw e; }
			return this.parseTypeNext(hscript.CType.CTAnon(fields));
		default:
			return this.unexpected(t);
		}
	}
	,parseTypeNext: function(t) {
		var tk = this.token();
		switch(tk[1]) {
		case 3:
			var op = tk[2];
			if(op != "->") {
				this.tokens.add(tk);
				return t;
			}
			break;
		default:
			this.tokens.add(tk);
			return t;
		}
		var t2 = this.parseType();
		switch(t2[1]) {
		case 1:
			var args = t2[2];
			args.unshift(t);
			return t2;
		default:
			return hscript.CType.CTFun([t],t2);
		}
	}
	,parseExprList: function(etk) {
		var args = new Array();
		var tk = this.token();
		if(tk == etk) return args;
		this.tokens.add(tk);
		try {
			while(true) {
				args.push(this.parseExpr());
				tk = this.token();
				switch(tk[1]) {
				case 9:
					break;
				default:
					if(tk == etk) throw "__break__";
					this.unexpected(tk);
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		return args;
	}
	,incPos: function() {
	}
	,readChar: function() {
		try {
			return this.input.readByte();
		} catch( e ) {
			return 0;
		}
	}
	,readString: function(until) {
		var c = 0;
		var b = new haxe.io.BytesOutput();
		var esc = false;
		var old = this.line;
		var s = this.input;
		while(true) {
			try {
				c = s.readByte();
			} catch( e ) {
				this.line = old;
				throw hscript.Error.EUnterminatedString;
			}
			if(esc) {
				esc = false;
				switch(c) {
				case 110:
					b.writeByte(10);
					break;
				case 114:
					b.writeByte(13);
					break;
				case 116:
					b.writeByte(9);
					break;
				case 39:case 34:case 92:
					b.writeByte(c);
					break;
				case 47:
					if(this.allowJSON) b.writeByte(c); else this.invalidChar(c);
					break;
				case 117:
					if(!this.allowJSON) throw this.invalidChar(c);
					var code = null;
					try {
						code = s.readString(4);
					} catch( e1 ) {
						this.line = old;
						throw hscript.Error.EUnterminatedString;
					}
					var k = 0;
					var _g = 0;
					while(_g < 4) {
						var i = _g++;
						k <<= 4;
						var $char = HxOverrides.cca(code,i);
						switch($char) {
						case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
							k += $char - 48;
							break;
						case 65:case 66:case 67:case 68:case 69:case 70:
							k += $char - 55;
							break;
						case 97:case 98:case 99:case 100:case 101:case 102:
							k += $char - 87;
							break;
						default:
							this.invalidChar($char);
						}
					}
					if(k <= 127) b.writeByte(k); else if(k <= 2047) {
						b.writeByte(192 | k >> 6);
						b.writeByte(128 | k & 63);
					} else {
						b.writeByte(224 | k >> 12);
						b.writeByte(128 | k >> 6 & 63);
						b.writeByte(128 | k & 63);
					}
					break;
				default:
					this.invalidChar(c);
				}
			} else if(c == 92) esc = true; else if(c == until) break; else {
				if(c == 10) this.line++;
				b.writeByte(c);
			}
		}
		return b.getBytes().toString();
	}
	,token: function() {
		if(!(this.tokens.head == null)) return this.tokens.pop();
		var $char;
		if(this["char"] < 0) $char = this.readChar(); else {
			$char = this["char"];
			this["char"] = -1;
		}
		while(true) {
			switch($char) {
			case 0:
				return hscript.Token.TEof;
			case 32:case 9:case 13:
				break;
			case 10:
				this.line++;
				break;
			case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
				var n = ($char - 48) * 1.0;
				var exp = 0.;
				while(true) {
					$char = this.readChar();
					exp *= 10;
					switch($char) {
					case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
						n = n * 10 + ($char - 48);
						break;
					case 46:
						if(exp > 0) {
							if(exp == 10 && this.readChar() == 46) {
								this.push(hscript.Token.TOp("..."));
								var i = n | 0;
								return hscript.Token.TConst(i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
							}
							this.invalidChar($char);
						}
						exp = 1.;
						break;
					case 120:
						if(n > 0 || exp > 0) this.invalidChar($char);
						var n1 = 0;
						while(true) {
							$char = this.readChar();
							switch($char) {
							case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
								n1 = (n1 << 4) + $char - 48;
								break;
							case 65:case 66:case 67:case 68:case 69:case 70:
								n1 = (n1 << 4) + ($char - 55);
								break;
							case 97:case 98:case 99:case 100:case 101:case 102:
								n1 = (n1 << 4) + ($char - 87);
								break;
							default:
								this["char"] = $char;
								return hscript.Token.TConst(hscript.Const.CInt(n1));
							}
						}
						break;
					default:
						this["char"] = $char;
						var i1 = n | 0;
						return hscript.Token.TConst(exp > 0?hscript.Const.CFloat(n * 10 / exp):i1 == n?hscript.Const.CInt(i1):hscript.Const.CFloat(n));
					}
				}
				break;
			case 59:
				return hscript.Token.TSemicolon;
			case 40:
				return hscript.Token.TPOpen;
			case 41:
				return hscript.Token.TPClose;
			case 44:
				return hscript.Token.TComma;
			case 46:
				$char = this.readChar();
				switch($char) {
				case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
					var n2 = $char - 48;
					var exp1 = 1;
					while(true) {
						$char = this.readChar();
						exp1 *= 10;
						switch($char) {
						case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
							n2 = n2 * 10 + ($char - 48);
							break;
						default:
							this["char"] = $char;
							return hscript.Token.TConst(hscript.Const.CFloat(n2 / exp1));
						}
					}
					break;
				case 46:
					$char = this.readChar();
					if($char != 46) this.invalidChar($char);
					return hscript.Token.TOp("...");
				default:
					this["char"] = $char;
					return hscript.Token.TDot;
				}
				break;
			case 123:
				return hscript.Token.TBrOpen;
			case 125:
				return hscript.Token.TBrClose;
			case 91:
				return hscript.Token.TBkOpen;
			case 93:
				return hscript.Token.TBkClose;
			case 39:
				return hscript.Token.TConst(hscript.Const.CString(this.readString(39)));
			case 34:
				return hscript.Token.TConst(hscript.Const.CString(this.readString(34)));
			case 63:
				return hscript.Token.TQuestion;
			case 58:
				return hscript.Token.TDoubleDot;
			default:
				if(this.ops[$char]) {
					var op = String.fromCharCode($char);
					while(true) {
						$char = this.readChar();
						if(!this.ops[$char]) {
							if(HxOverrides.cca(op,0) == 47) return this.tokenComment(op,$char);
							this["char"] = $char;
							return hscript.Token.TOp(op);
						}
						op += String.fromCharCode($char);
					}
				}
				if(this.idents[$char]) {
					var id = String.fromCharCode($char);
					while(true) {
						$char = this.readChar();
						if(!this.idents[$char]) {
							this["char"] = $char;
							return hscript.Token.TId(id);
						}
						id += String.fromCharCode($char);
					}
				}
				this.invalidChar($char);
			}
			$char = this.readChar();
		}
		return null;
	}
	,tokenComment: function(op,$char) {
		var c = HxOverrides.cca(op,1);
		var s = this.input;
		if(c == 47) {
			try {
				while($char != 10 && $char != 13) $char = s.readByte();
				this["char"] = $char;
			} catch( e ) {
			}
			return this.token();
		}
		if(c == 42) {
			var old = this.line;
			try {
				while(true) {
					while($char != 42) {
						if($char == 10) this.line++;
						$char = s.readByte();
					}
					$char = s.readByte();
					if($char == 47) break;
				}
			} catch( e1 ) {
				this.line = old;
				throw hscript.Error.EUnterminatedComment;
			}
			return this.token();
		}
		this["char"] = $char;
		return hscript.Token.TOp(op);
	}
	,constString: function(c) {
		switch(c[1]) {
		case 0:
			var v = c[2];
			if(v == null) return "null"; else return "" + v;
			break;
		case 1:
			var f = c[2];
			if(f == null) return "null"; else return "" + f;
			break;
		case 2:
			var s = c[2];
			return s;
		}
	}
	,tokenString: function(t) {
		switch(t[1]) {
		case 0:
			return "<eof>";
		case 1:
			var c = t[2];
			return this.constString(c);
		case 2:
			var s = t[2];
			return s;
		case 3:
			var s1 = t[2];
			return s1;
		case 4:
			return "(";
		case 5:
			return ")";
		case 6:
			return "{";
		case 7:
			return "}";
		case 8:
			return ".";
		case 9:
			return ",";
		case 10:
			return ";";
		case 11:
			return "[";
		case 12:
			return "]";
		case 13:
			return "?";
		case 14:
			return ":";
		}
	}
	,__class__: hscript.Parser
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
$hxClasses["hxparse.LexEngine"] = hxparse.LexEngine;
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
hxparse._LexEngine.Pattern = $hxClasses["hxparse._LexEngine.Pattern"] = { __ename__ : ["hxparse","_LexEngine","Pattern"], __constructs__ : ["Empty","Match","Star","Plus","Next","Choice","Group"] };
hxparse._LexEngine.Pattern.Empty = ["Empty",0];
hxparse._LexEngine.Pattern.Empty.toString = $estr;
hxparse._LexEngine.Pattern.Empty.__enum__ = hxparse._LexEngine.Pattern;
hxparse._LexEngine.Pattern.Match = function(c) { var $x = ["Match",1,c]; $x.__enum__ = hxparse._LexEngine.Pattern; $x.toString = $estr; return $x; };
hxparse._LexEngine.Pattern.Star = function(p) { var $x = ["Star",2,p]; $x.__enum__ = hxparse._LexEngine.Pattern; $x.toString = $estr; return $x; };
hxparse._LexEngine.Pattern.Plus = function(p) { var $x = ["Plus",3,p]; $x.__enum__ = hxparse._LexEngine.Pattern; $x.toString = $estr; return $x; };
hxparse._LexEngine.Pattern.Next = function(p1,p2) { var $x = ["Next",4,p1,p2]; $x.__enum__ = hxparse._LexEngine.Pattern; $x.toString = $estr; return $x; };
hxparse._LexEngine.Pattern.Choice = function(p1,p2) { var $x = ["Choice",5,p1,p2]; $x.__enum__ = hxparse._LexEngine.Pattern; $x.toString = $estr; return $x; };
hxparse._LexEngine.Pattern.Group = function(p) { var $x = ["Group",6,p]; $x.__enum__ = hxparse._LexEngine.Pattern; $x.toString = $estr; return $x; };
hxparse._LexEngine.Node = function(id,pid) {
	this.id = id;
	this.pid = pid;
	this.trans = [];
	this.epsilon = [];
};
$hxClasses["hxparse._LexEngine.Node"] = hxparse._LexEngine.Node;
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
$hxClasses["hxparse._LexEngine.Transition"] = hxparse._LexEngine.Transition;
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
$hxClasses["hxparse.Lexer"] = hxparse.Lexer;
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
$hxClasses["hxparse.NoMatch"] = hxparse.NoMatch;
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
$hxClasses["hxparse.Parser"] = hxparse.Parser;
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
$hxClasses["hxparse.ParserBuilder"] = hxparse.ParserBuilder;
hxparse.ParserBuilder.__name__ = ["hxparse","ParserBuilder"];
hxparse.Parser_qa_algebra_AlgebraLexer_qa_algebra_AlgebraToken = function(stream,ruleset) {
	this.stream = stream;
	this.ruleset = ruleset;
};
$hxClasses["hxparse.Parser_qa_algebra_AlgebraLexer_qa_algebra_AlgebraToken"] = hxparse.Parser_qa_algebra_AlgebraLexer_qa_algebra_AlgebraToken;
hxparse.Parser_qa_algebra_AlgebraLexer_qa_algebra_AlgebraToken.__name__ = ["hxparse","Parser_qa_algebra_AlgebraLexer_qa_algebra_AlgebraToken"];
hxparse.Parser_qa_algebra_AlgebraLexer_qa_algebra_AlgebraToken.prototype = {
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
	,__class__: hxparse.Parser_qa_algebra_AlgebraLexer_qa_algebra_AlgebraToken
};
hxparse.Position = function(source,min,max) {
	this.psource = source;
	this.pmin = min;
	this.pmax = max;
};
$hxClasses["hxparse.Position"] = hxparse.Position;
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
$hxClasses["hxparse.RuleBuilder"] = hxparse.RuleBuilder;
hxparse.RuleBuilder.__name__ = ["hxparse","RuleBuilder"];
hxparse.RuleBuilderImpl = function() { };
$hxClasses["hxparse.RuleBuilderImpl"] = hxparse.RuleBuilderImpl;
hxparse.RuleBuilderImpl.__name__ = ["hxparse","RuleBuilderImpl"];
hxparse.Ruleset = function(state,functions,eofFunction,name) {
	if(name == null) name = "";
	this.state = state;
	this.functions = functions;
	this.eofFunction = eofFunction;
	this.name = name;
};
$hxClasses["hxparse.Ruleset"] = hxparse.Ruleset;
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
$hxClasses["hxparse.State"] = hxparse.State;
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
$hxClasses["hxparse.Unexpected"] = hxparse.Unexpected;
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
$hxClasses["hxparse.UnexpectedChar"] = hxparse.UnexpectedChar;
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
$hxClasses["js.Boot"] = js.Boot;
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
js.Browser = function() { };
$hxClasses["js.Browser"] = js.Browser;
js.Browser.__name__ = ["js","Browser"];
js.Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") return new XMLHttpRequest();
	if(typeof ActiveXObject != "undefined") return new ActiveXObject("Microsoft.XMLHTTP");
	throw "Unable to create XMLHttpRequest object.";
};
var qa = {};
qa.DateExtra = function() { };
$hxClasses["qa.DateExtra"] = qa.DateExtra;
qa.DateExtra.__name__ = ["qa","DateExtra"];
qa.DateExtra.colloquialElapsedTime = function(date) {
	var now = new Date();
	var t = now.getTime() - date.getTime();
	var sec = t / 1000;
	if(sec < 50) return "moments ago";
	var min = sec / 60;
	if(min < 1.1) return "a minute ago";
	if(min < 2.1) return "two minutes ago";
	if(min < 5) return "a few minutes ago";
	if(min < 55) return Math.round(min) + " minutes ago";
	var hrs = min / 60;
	if(hrs < 1.1) return "an hour ago";
	if(hrs < 1.5) return "over an hour ago";
	if(hrs < 5.5) return Math.round(hrs) + " hours ago";
	var dys = hrs / 24;
	if(dys < 1) {
		if(now.getDate() == date.getDate()) return "today";
		return "yesterday";
	}
	if(dys < 1.7) return "over a day ago";
	if(dys < 6.5) return Math.round(dys - 0.2) + " days ago";
	var wks = dys / 7;
	if(wks < 1.1) return "a week ago";
	if(wks < 1.5) return "over a week ago";
	if(wks < 1.8) return "almost two weeks ago";
	if(wks < 3.8) return Math.round(wks - 0.3) + " weeks ago";
	return qa.DateExtra.readableDate(date);
};
qa.DateExtra.readableDate = function(date) {
	var day = date.getDate();
	var tens = Math.floor(day % 100 / 10);
	var units = day % 10;
	var suffix;
	if(tens == 1) suffix = "th"; else if(units == 1) suffix = "st"; else if(units == 2) suffix = "nd"; else if(units == 3) suffix = "rd"; else suffix = "th";
	var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	return day + suffix + " " + months[date.getMonth()] + " " + date.getFullYear();
};
qa.Ksi = function() {
	this.pendingQueries = new Array();
	this.pending = new List();
	this.providers = new List();
	this.providers.add(new qa.providers.hscript.HScriptParserProvider());
	this.providers.add(new qa.providers.hscript.HScriptInterpProvider(false));
	this.providers.add(new qa.providers.AlgebraParserProvider());
	this.providers.add(new qa.providers.AlgebraEvalProvider());
	this.providers.add(new qa.providers.MathBoxProvider());
	this.providers.add(new qa.providers.OpenWeatherMapProvider());
	this.providers.add(new qa.providers.WeatherReportDisplayProvider());
};
$hxClasses["qa.Ksi"] = qa.Ksi;
qa.Ksi.__name__ = ["qa","Ksi"];
qa.Ksi.prototype = {
	providers: null
	,pending: null
	,answerCount: null
	,pendingQueries: null
	,onAnswer: function(answer) {
	}
	,onFinish: function() {
	}
	,answer: function(text) {
		this.answerCount = 0;
		var $it0 = this.providers.iterator();
		while( $it0.hasNext() ) {
			var provider = $it0.next();
			provider.reset();
		}
		while(this.pendingQueries.length > 0) this.pendingQueries.pop().cancel();
		this.pending.clear();
		this.pending.add(text);
		this.answerNext();
	}
	,answerNext: function() {
		if(this.answerCount++ > 10) return;
		var question = this.pending.pop();
		var queries = this.query(question);
		var _g = 0;
		while(_g < queries.length) {
			var q = queries[_g];
			++_g;
			this.pendingQueries.push(q);
			q.onResult = $bind(this,this.queryResult);
			q.run();
		}
	}
	,queryResult: function(q) {
		HxOverrides.remove(this.pendingQueries,q);
		{
			var _g = q.result;
			switch(_g[1]) {
			case 0:
				break;
			case 1:
				var msg = _g[2];
				var display = new qa.providers.SimpleDisplay(msg);
				this.queryResultDisplay(q,display);
				break;
			case 2:
				var display1 = _g[3];
				var item = _g[2];
				this.pending.add(item);
				this.queryResultDisplay(q,display1);
				this.answerNext();
				break;
			}
		}
		if(this.pendingQueries.length == 0) this.onFinish();
	}
	,queryResultDisplay: function(q,display) {
		display.provider = q.provider;
		this.onAnswer({ question : "" + Std.string(q.question), display : display, debug : "meh"});
	}
	,query: function(item) {
		var results = [];
		var $it0 = this.providers.iterator();
		while( $it0.hasNext() ) {
			var provider = $it0.next();
			var providerName = Type.getClassName(Type.getClass(provider));
			var query = provider.query(item);
			query.provider = provider;
			query.question = item;
			results.push(query);
		}
		return results;
	}
	,__class__: qa.Ksi
};
qa.ValuePrinter = function() { };
$hxClasses["qa.ValuePrinter"] = qa.ValuePrinter;
qa.ValuePrinter.__name__ = ["qa","ValuePrinter"];
qa.ValuePrinter.printWithUnit = function(d,unit) {
	return Std.string(d) + unit;
};
qa.ValuePrinter.printPercent = function(p) {
	return "" + qa._Values.Percent_Impl_.toString(p);
};
qa.ValuePrinter.printPressure = function(p) {
	return "" + Std.string(p);
};
qa.ValuePrinter.printUnixTime = function(time) {
	return qa.DateExtra.colloquialElapsedTime((function($this) {
		var $r;
		var d = new Date();
		d.setTime((function($this) {
			var $r;
			var $int = time;
			$r = $int < 0?4294967296.0 + $int:$int + 0.0;
			return $r;
		}($this)) * 1000);
		$r = d;
		return $r;
	}(this)));
};
qa.ValuePrinter.printLocation = function(location) {
	if(location.name == "") return location.country; else return "" + location.name + ", " + location.country;
};
qa.ValuePrinter.printPosition = function(position) {
	return "\r\n\t\t\t<dl><dt>Latitude</dt><dd>" + position.latitude + "</dd></dl>\r\n\t\t\t<dl><dt>Longitude</dt><dd>" + position.longitude + "</dd></dl>\r\n\t\t";
};
qa.ValuePrinter.printWind = function(wind) {
	return "\r\n\t\t\t<dl><dt>Speed</dt><dd>" + qa._Values.MetersPerSecond_Impl_.toString(wind.speed) + "</dd></dl>\r\n\t\t\t<dl><dt>Direction</dt><dd>" + qa._Values.Degree_Impl_.toString(wind.direction) + "</dd></dl>\r\n\t\t";
};
qa.ValuePrinter.printWeather = function(w) {
	var iconName;
	var _g = w.id;
	switch(_g) {
	case 200:case 201:case 202:case 210:case 211:case 212:case 221:case 960:case 961:
		iconName = "thunderstorm";
		break;
	case 230:case 231:case 232:
		iconName = "storm-showers";
		break;
	case 300:case 301:case 302:case 310:case 311:case 312:case 313:case 314:case 321:
		iconName = "sprinkle";
		break;
	case 500:case 501:case 502:
		iconName = "rain";
		break;
	case 503:case 504:
		iconName = "rain-wind";
		break;
	case 511:
		iconName = "rain-mix";
		break;
	case 520:case 521:case 522:case 531:
		iconName = "showers";
		break;
	case 600:case 601:case 602:case 620:case 621:case 622:
		iconName = "snow";
		break;
	case 611:case 612:case 615:case 616:
		iconName = "rain-mix";
		break;
	case 701:case 711:case 721:case 741:
		iconName = "fog";
		break;
	case 731:case 751:case 761:case 762:
		iconName = "windy";
		break;
	case 771:case 905:case 957:case 958:case 959:
		iconName = "strong-wind";
		break;
	case 781:case 900:case 901:case 962:
		iconName = "tornado";
		break;
	case 800:
		iconName = "day-sunny";
		break;
	case 801:case 802:
		iconName = "day-cloudy";
		break;
	case 803:case 804:
		iconName = "cloudy";
		break;
	case 903:case 904:
		iconName = "thermometer";
		break;
	case 906:
		iconName = "hail";
		break;
	case 950:
		iconName = "sunset";
		break;
	case 951:
		iconName = "down";
		break;
	case 952:case 953:case 954:case 955:case 956:
		iconName = "windy";
		break;
	default:
		iconName = "day-lightning";
	}
	var icon = "<i class=\"wi-" + iconName + "\"></i>";
	return "" + icon + " " + w.name + " (" + w.description + ")";
};
qa.ValuePrinter.printTemperature = function(temp) {
	return "" + qa._Values.Celsius_Impl_.toString(qa._Values.Celsius_Impl_.fromKelvin(temp));
};
qa.ValuePrinter.printInfoTag = function(id,name,value) {
	return "\r\n\t\t\t<dl class=\"info-tag info-tag-" + id + "\">\r\n\t\t\t\t<dt>" + name + "</dt>\r\n\t\t\t\t<dd>" + value + "</dd>\r\n\t\t\t</dl>\r\n\t\t";
};
qa.Unit = $hxClasses["qa.Unit"] = { __ename__ : ["qa","Unit"], __constructs__ : ["Meter"] };
qa.Unit.Meter = ["Meter",0];
qa.Unit.Meter.toString = $estr;
qa.Unit.Meter.__enum__ = qa.Unit;
qa._Values = {};
qa._Values.Percent_Impl_ = function() { };
$hxClasses["qa._Values.Percent_Impl_"] = qa._Values.Percent_Impl_;
qa._Values.Percent_Impl_.__name__ = ["qa","_Values","Percent_Impl_"];
qa._Values.Percent_Impl_.toString = function(this1) {
	return this1 + "%";
};
qa._Values.Degree_Impl_ = function() { };
$hxClasses["qa._Values.Degree_Impl_"] = qa._Values.Degree_Impl_;
qa._Values.Degree_Impl_.__name__ = ["qa","_Values","Degree_Impl_"];
qa._Values.Degree_Impl_.toString = function(this1) {
	return this1 + "°";
};
qa._Values.Celsius_Impl_ = function() { };
$hxClasses["qa._Values.Celsius_Impl_"] = qa._Values.Celsius_Impl_;
qa._Values.Celsius_Impl_.__name__ = ["qa","_Values","Celsius_Impl_"];
qa._Values.Celsius_Impl_.fromKelvin = function(k) {
	return k - 273.15;
};
qa._Values.Celsius_Impl_.toString = function(this1) {
	return Math.round(this1 * 100) / 100 + "°C";
};
qa._Values.RelativeHumidity_Impl_ = function() { };
$hxClasses["qa._Values.RelativeHumidity_Impl_"] = qa._Values.RelativeHumidity_Impl_;
qa._Values.RelativeHumidity_Impl_.__name__ = ["qa","_Values","RelativeHumidity_Impl_"];
qa._Values.RelativeHumidity_Impl_.toString = function(this1) {
	return qa._Values.Percent_Impl_.toString(this1);
};
qa._Values.MetersPerSecond_Impl_ = function() { };
$hxClasses["qa._Values.MetersPerSecond_Impl_"] = qa._Values.MetersPerSecond_Impl_;
qa._Values.MetersPerSecond_Impl_.__name__ = ["qa","_Values","MetersPerSecond_Impl_"];
qa._Values.MetersPerSecond_Impl_.toString = function(this1) {
	return this1 + " m/s";
};
qa.WeatherReport = function() {
	this.weather = new Array();
};
$hxClasses["qa.WeatherReport"] = qa.WeatherReport;
qa.WeatherReport.__name__ = ["qa","WeatherReport"];
qa.WeatherReport.prototype = {
	time: null
	,coordinates: null
	,location: null
	,temperature: null
	,minimumTemperature: null
	,maximumTemperature: null
	,humidity: null
	,pressure: null
	,wind: null
	,cloudCover: null
	,weather: null
	,__class__: qa.WeatherReport
};
qa.algebra = {};
qa.algebra.MathExpression = $hxClasses["qa.algebra.MathExpression"] = { __ename__ : ["qa","algebra","MathExpression"], __constructs__ : ["ESymbol","EBinop","EParenthesis","ENeg","EPartial","EFunction"] };
qa.algebra.MathExpression.ESymbol = function(c) { var $x = ["ESymbol",0,c]; $x.__enum__ = qa.algebra.MathExpression; $x.toString = $estr; return $x; };
qa.algebra.MathExpression.EBinop = function(op,e1,e2) { var $x = ["EBinop",1,op,e1,e2]; $x.__enum__ = qa.algebra.MathExpression; $x.toString = $estr; return $x; };
qa.algebra.MathExpression.EParenthesis = function(e) { var $x = ["EParenthesis",2,e]; $x.__enum__ = qa.algebra.MathExpression; $x.toString = $estr; return $x; };
qa.algebra.MathExpression.ENeg = function(e) { var $x = ["ENeg",3,e]; $x.__enum__ = qa.algebra.MathExpression; $x.toString = $estr; return $x; };
qa.algebra.MathExpression.EPartial = function(e) { var $x = ["EPartial",4,e]; $x.__enum__ = qa.algebra.MathExpression; $x.toString = $estr; return $x; };
qa.algebra.MathExpression.EFunction = function(name,args) { var $x = ["EFunction",5,name,args]; $x.__enum__ = qa.algebra.MathExpression; $x.toString = $estr; return $x; };
qa.algebra.Constant = $hxClasses["qa.algebra.Constant"] = { __ename__ : ["qa","algebra","Constant"], __constructs__ : ["CInteger","CRational","CReal","CMathematical"] };
qa.algebra.Constant.CInteger = function(n,format) { var $x = ["CInteger",0,n,format]; $x.__enum__ = qa.algebra.Constant; $x.toString = $estr; return $x; };
qa.algebra.Constant.CRational = function(n) { var $x = ["CRational",1,n]; $x.__enum__ = qa.algebra.Constant; $x.toString = $estr; return $x; };
qa.algebra.Constant.CReal = function(n) { var $x = ["CReal",2,n]; $x.__enum__ = qa.algebra.Constant; $x.toString = $estr; return $x; };
qa.algebra.Constant.CMathematical = function(c,symbol) { var $x = ["CMathematical",3,c,symbol]; $x.__enum__ = qa.algebra.Constant; $x.toString = $estr; return $x; };
qa.algebra.Symbol = $hxClasses["qa.algebra.Symbol"] = { __ename__ : ["qa","algebra","Symbol"], __constructs__ : ["SConst","SVariable"] };
qa.algebra.Symbol.SConst = function(c) { var $x = ["SConst",0,c]; $x.__enum__ = qa.algebra.Symbol; $x.toString = $estr; return $x; };
qa.algebra.Symbol.SVariable = function(name) { var $x = ["SVariable",1,name]; $x.__enum__ = qa.algebra.Symbol; $x.toString = $estr; return $x; };
qa.algebra.AlgebraBinop = $hxClasses["qa.algebra.AlgebraBinop"] = { __ename__ : ["qa","algebra","AlgebraBinop"], __constructs__ : ["OpAdd","OpSub","OpMul","OpDiv","OpPow"] };
qa.algebra.AlgebraBinop.OpAdd = ["OpAdd",0];
qa.algebra.AlgebraBinop.OpAdd.toString = $estr;
qa.algebra.AlgebraBinop.OpAdd.__enum__ = qa.algebra.AlgebraBinop;
qa.algebra.AlgebraBinop.OpSub = ["OpSub",1];
qa.algebra.AlgebraBinop.OpSub.toString = $estr;
qa.algebra.AlgebraBinop.OpSub.__enum__ = qa.algebra.AlgebraBinop;
qa.algebra.AlgebraBinop.OpMul = ["OpMul",2];
qa.algebra.AlgebraBinop.OpMul.toString = $estr;
qa.algebra.AlgebraBinop.OpMul.__enum__ = qa.algebra.AlgebraBinop;
qa.algebra.AlgebraBinop.OpDiv = ["OpDiv",3];
qa.algebra.AlgebraBinop.OpDiv.toString = $estr;
qa.algebra.AlgebraBinop.OpDiv.__enum__ = qa.algebra.AlgebraBinop;
qa.algebra.AlgebraBinop.OpPow = ["OpPow",4];
qa.algebra.AlgebraBinop.OpPow.toString = $estr;
qa.algebra.AlgebraBinop.OpPow.__enum__ = qa.algebra.AlgebraBinop;
qa.algebra.Algebra = function() { };
$hxClasses["qa.algebra.Algebra"] = qa.algebra.Algebra;
qa.algebra.Algebra.__name__ = ["qa","algebra","Algebra"];
qa.algebra.Algebra.getPrecedenceRank = function(op) {
	switch(op[1]) {
	case 0:
		return 0;
	case 1:
		return 1;
	case 2:
		return 2;
	case 3:
		return 3;
	case 4:
		return 4;
	}
};
qa.algebra.Algebra.getConstantRank = function(c) {
	switch(c[1]) {
	case 0:
		return 0;
	case 1:
		return 1;
	case 2:
		return 2;
	case 3:
		var c1 = c[2];
		return 3;
	}
};
qa.algebra.Algebra.changeRank = function(c,base,state) {
	var rb = qa.algebra.Algebra.getConstantRank(base);
	var rc = qa.algebra.Algebra.getConstantRank(c);
	while(rc != rb) {
		if(rc < rb) {
			var p = qa.algebra.Algebra.promoteConst(c);
			if(state != null) state.addStep(qa.algebra.EvalStepType.Promote(c,p));
			c = p;
		} else {
			var d = qa.algebra.Algebra.demoteConst(c);
			if(state != null) state.addStep(qa.algebra.EvalStepType.Demote(c,d));
			c = d;
		}
		var nrc = qa.algebra.Algebra.getConstantRank(c);
		if(nrc == rc) throw "Constant rank change error " + Std.string(c) + "(" + rc + " == " + nrc + ") " + Std.string(base) + "(" + rb + ")";
		rc = nrc;
	}
	return c;
};
qa.algebra.Algebra.promoteConst = function(c) {
	switch(c[1]) {
	case 0:
		var n = c[2];
		return qa.algebra.Constant.CRational(qa.arithmetic._Arithmetic.Integer_Impl_.toSimpleFraction(n));
	case 1:
		var n1 = c[2];
		return qa.algebra.Constant.CReal(qa.arithmetic._Arithmetic.SimpleFraction_Impl_.toReal(n1));
	default:
		throw "Unimplemented rank promotion for " + Std.string(c);
	}
};
qa.algebra.Algebra.demoteConst = function(c) {
	switch(c[1]) {
	case 3:
		var c1 = c[2];
		return c1;
	default:
		throw "Unimplemented rank demotion for " + Std.string(c);
	}
};
qa.algebra.AlgebraPrinter = function() { };
$hxClasses["qa.algebra.AlgebraPrinter"] = qa.algebra.AlgebraPrinter;
qa.algebra.AlgebraPrinter.__name__ = ["qa","algebra","AlgebraPrinter"];
qa.algebra.AlgebraPrinter.getTag = function(s) {
	var tagName = StringTools.replace(s," ","-");
	return "<span class=\"tag tag-" + tagName + "\">" + s + "</span>";
};
qa.algebra.AlgebraPrinter.getExpressionTag = function(e) {
	return qa.algebra.AlgebraPrinter.getTag((function($this) {
		var $r;
		switch(e[1]) {
		case 5:
			$r = "fun";
			break;
		case 0:
			$r = (function($this) {
				var $r;
				switch(e[2][1]) {
				case 0:
					$r = "const";
					break;
				case 1:
					$r = "var";
					break;
				}
				return $r;
			}($this));
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
		case 4:
			$r = "partial";
			break;
		}
		return $r;
	}(this)));
};
qa.algebra.AlgebraPrinter.printEvalStep = function(step) {
	var type;
	{
		var _g = step.type;
		switch(_g[1]) {
		case 2:
			var p = _g[3];
			var c = _g[2];
			type = qa.algebra.AlgebraPrinter.getTag("promoted") + ("" + qa.algebra.AlgebraPrinter.printConstant(c) + " to " + qa.algebra.AlgebraPrinter.printConstant(p));
			break;
		case 3:
			var d = _g[3];
			var c1 = _g[2];
			type = qa.algebra.AlgebraPrinter.getTag("demoted") + ("" + qa.algebra.AlgebraPrinter.printConstant(c1) + " to " + qa.algebra.AlgebraPrinter.printConstant(d));
			break;
		case 0:
			var e = _g[2];
			var expr;
			switch(e[1]) {
			case 5:
				expr = qa.algebra.AlgebraPrinter.printTexInline(e);
				break;
			case 4:
				var e1 = e[2];
				expr = qa.algebra.AlgebraPrinter.printTexInline(e1);
				break;
			case 0:
				switch(e[2][1]) {
				case 0:
					var c2 = e[2][2];
					expr = qa.algebra.AlgebraPrinter.printConstant(c2);
					break;
				case 1:
					var name = e[2][2];
					expr = name;
					break;
				}
				break;
			case 1:
				var e2 = e[4];
				var e11 = e[3];
				var c3 = e[2];
				expr = qa.algebra.AlgebraPrinter.wrapTexInline(qa.algebra.AlgebraPrinter.printTexMath(e,true));
				break;
			case 2:
				var e3 = e[2];
				expr = "";
				break;
			case 3:
				var e4 = e[2];
				expr = qa.algebra.AlgebraPrinter.printTexInline(e4);
				break;
			}
			type = qa.algebra.AlgebraPrinter.getExpressionTag(e) + expr;
			break;
		case 1:
			var e5 = _g[2];
			type = qa.algebra.AlgebraPrinter.getTag("result") + " \\(\\rightarrow\\) " + qa.algebra.AlgebraPrinter.getExpressionTag(e5) + qa.algebra.AlgebraPrinter.wrapTexInline(qa.algebra.AlgebraPrinter.printTexMath(e5,true));
			break;
		case 4:
			var s = _g[2];
			type = qa.algebra.AlgebraPrinter.getTag("unknown symbol") + qa.algebra.AlgebraPrinter.printTexInline(qa.algebra.MathExpression.ESymbol(s));
			break;
		}
	}
	return "<div class=\"step\" style=\"margin-left: " + step.level + "em;\">" + type + "</div>";
};
qa.algebra.AlgebraPrinter.printConstant = function(c) {
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
	case 3:
		var symbol = c[3];
		type = "mathematical " + symbol;
		break;
	}
	return "" + type + " \\(" + qa.algebra.AlgebraPrinter.printTexMath(qa.algebra.MathExpression.ESymbol(qa.algebra.Symbol.SConst(c))) + "\\)";
};
qa.algebra.AlgebraPrinter.printTex = function(expr) {
	return "$$" + qa.algebra.AlgebraPrinter.printTexMath(expr) + "$$";
};
qa.algebra.AlgebraPrinter.printTexInline = function(expr) {
	return qa.algebra.AlgebraPrinter.wrapTexInline(qa.algebra.AlgebraPrinter.printTexMath(expr));
};
qa.algebra.AlgebraPrinter.wrapTexInline = function(tex) {
	return "\\(" + tex + "\\)";
};
qa.algebra.AlgebraPrinter.highlight = function(s) {
	return "\\color{darkorange}{" + s + "}";
};
qa.algebra.AlgebraPrinter.printTexMath = function(expr,highlightBinop) {
	if(highlightBinop == null) highlightBinop = false;
	switch(expr[1]) {
	case 5:
		var args = expr[3];
		var name = expr[2];
		return "\\mathrm{" + name + "}\\left(" + args.map((function(f,a2) {
			return function(a1) {
				return f(a1,a2);
			};
		})(qa.algebra.AlgebraPrinter.printTexMath,false)).join(", ") + "\\right)";
	case 4:
		var e = expr[2];
		return "\\left<" + qa.algebra.AlgebraPrinter.printTexMath(e) + "\\right>";
	case 0:
		switch(expr[2][1]) {
		case 0:
			var c = expr[2][2];
			switch(c[1]) {
			case 0:
				var format = c[3];
				var n = c[2];
				switch(format[1]) {
				case 1:case 0:
					return qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add("",n));
				case 2:
					return "\\mathtt{" + StringTools.hex(n,0) + "}_{16}";
				}
				break;
			case 1:
				var n1 = c[2];
				return "\\left(\\frac{" + qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.SimpleFraction_Impl_.getNumerator(n1)) + "}{" + qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.SimpleFraction_Impl_.getDenominator(n1)) + "}\\right)";
			case 2:
				var n2 = c[2];
				return "" + qa.arithmetic._Arithmetic.Real_Impl_.toString(n2);
			case 3:
				var symbol = c[3];
				return symbol;
			}
			break;
		case 1:
			var name1 = expr[2][2];
			return "\\mathtt{" + name1 + "}";
		}
		break;
	case 1:
		var e2 = expr[4];
		var e1 = expr[3];
		var op = expr[2];
		var p1 = qa.algebra.AlgebraPrinter.printTexMath(qa.algebra.AlgebraPrinter.wrapParens(e1,op));
		var p2 = qa.algebra.AlgebraPrinter.printTexMath(qa.algebra.AlgebraPrinter.wrapParens(e2,op));
		switch(op[1]) {
		case 0:
			return "" + p1 + " " + (highlightBinop?qa.algebra.AlgebraPrinter.highlight("+"):"+") + (" " + p2);
		case 1:
			return "" + p1 + " " + (highlightBinop?qa.algebra.AlgebraPrinter.highlight("-"):"-") + (" " + p2);
		case 2:
			return "" + p1 + " " + (highlightBinop?qa.algebra.AlgebraPrinter.highlight("\\times"):"\\times") + (" " + p2);
		case 4:
			return "" + p1 + "^{" + p2 + "}";
		case 3:
			p1 = qa.algebra.AlgebraPrinter.printTexMath(e1);
			p2 = qa.algebra.AlgebraPrinter.printTexMath(e2);
			return "\\frac{" + p1 + "}{" + p2 + "}";
		}
		break;
	case 2:
		var e3 = expr[2];
		return "\\left(" + qa.algebra.AlgebraPrinter.printTexMath(e3) + "\\right)";
	case 3:
		var e4 = expr[2];
		return "-" + qa.algebra.AlgebraPrinter.printTexMath(e4);
	}
};
qa.algebra.AlgebraPrinter.wrapParens = function(e,pop) {
	e = qa.algebra.AlgebraPrinter.escapeParens(e);
	switch(e[1]) {
	case 4:
		var e1 = e[2];
		return qa.algebra.AlgebraPrinter.wrapParens(e1,pop);
	case 1:
		var e2 = e[4];
		var e11 = e[3];
		var op = e[2];
		if(qa.algebra.Algebra.getPrecedenceRank(pop) > qa.algebra.Algebra.getPrecedenceRank(op)) return qa.algebra.MathExpression.EParenthesis(e); else return e;
		break;
	case 0:
		switch(e[2][1]) {
		case 0:
			return e;
		default:
			return qa.algebra.MathExpression.EParenthesis(e);
		}
		break;
	default:
		return qa.algebra.MathExpression.EParenthesis(e);
	}
};
qa.algebra.AlgebraPrinter.escapeParens = function(expr) {
	switch(expr[1]) {
	case 2:
		var e = expr[2];
		return qa.algebra.AlgebraPrinter.escapeParens(e);
	default:
		return expr;
	}
};
qa.algebra.EvalStepType = $hxClasses["qa.algebra.EvalStepType"] = { __ename__ : ["qa","algebra","EvalStepType"], __constructs__ : ["Expression","Result","Promote","Demote","UnknownSymbol"] };
qa.algebra.EvalStepType.Expression = function(e) { var $x = ["Expression",0,e]; $x.__enum__ = qa.algebra.EvalStepType; $x.toString = $estr; return $x; };
qa.algebra.EvalStepType.Result = function(c) { var $x = ["Result",1,c]; $x.__enum__ = qa.algebra.EvalStepType; $x.toString = $estr; return $x; };
qa.algebra.EvalStepType.Promote = function(c,p) { var $x = ["Promote",2,c,p]; $x.__enum__ = qa.algebra.EvalStepType; $x.toString = $estr; return $x; };
qa.algebra.EvalStepType.Demote = function(c,d) { var $x = ["Demote",3,c,d]; $x.__enum__ = qa.algebra.EvalStepType; $x.toString = $estr; return $x; };
qa.algebra.EvalStepType.UnknownSymbol = function(s) { var $x = ["UnknownSymbol",4,s]; $x.__enum__ = qa.algebra.EvalStepType; $x.toString = $estr; return $x; };
qa.algebra.EvalState = function() {
	this.functionMap = new haxe.ds.StringMap();
	this.evalPartial = false;
	this.boundVars = new haxe.ds.StringMap();
	this.steps = new Array();
	var v = qa.algebra.Constant.CMathematical(qa.algebra.Constant.CReal(3.1415926535897932384626433832795028841971693993751058),"𝜋");
	this.boundVars.set("pi",v);
	v;
	var v1 = qa.algebra.Constant.CMathematical(qa.algebra.Constant.CReal(6.2831853071795864769252867665590057683943387987502116),"𝜏");
	this.boundVars.set("tau",v1);
	v1;
	var v2 = qa.algebra.Constant.CMathematical(qa.algebra.Constant.CReal(2.71828182845904523536028747135266249775724709369995),"e");
	this.boundVars.set("e",v2);
	v2;
	var v3 = qa.algebra.Constant.CMathematical(qa.algebra.Constant.CReal(1.61803398874989484820458683436563811),"ϕ");
	this.boundVars.set("phi",v3);
	v3;
	this.addSingleReal("sin",Math.sin);
	this.addSingleReal("cos",Math.cos);
	this.addSingleReal("tan",Math.tan);
	this.addSingleReal("atan",Math.atan);
	this.addSingleReal("acos",Math.acos);
	this.addSingleReal("asin",Math.asin);
	this.addSingleReal("abs",Math.abs);
	this.addSingleReal("ceil",Math.ceil);
	this.addSingleReal("floor",Math.floor);
	this.addSingleReal("round",Math.round);
	this.addSingleReal("log",Math.log);
};
$hxClasses["qa.algebra.EvalState"] = qa.algebra.EvalState;
qa.algebra.EvalState.__name__ = ["qa","algebra","EvalState"];
qa.algebra.EvalState.prototype = {
	currentLevel: null
	,steps: null
	,boundVars: null
	,evalPartial: null
	,functionMap: null
	,addSingleReal: function(name,f) {
		this.functionMap.set(name,function(name1,args,state) {
			if(args.length != 1) throw "Invalid function argument count";
			var arg = qa.algebra.AlgebraEvaluator["eval"](args[0],state);
			switch(arg[1]) {
			case 0:
				switch(arg[2][1]) {
				case 0:
					var c = arg[2][2];
					{
						var _g = qa.algebra.Algebra.changeRank(c,qa.algebra.Constant.CReal(0));
						switch(_g[1]) {
						case 2:
							var n = _g[2];
							return qa.algebra.MathExpression.ESymbol(qa.algebra.Symbol.SConst(qa.algebra.Constant.CReal(f(n))));
						default:
							throw "Unable to change constant rank";
						}
					}
					break;
				default:
					return qa.algebra.MathExpression.EPartial(qa.algebra.MathExpression.EFunction(name1,[arg]));
				}
				break;
			default:
				return qa.algebra.MathExpression.EPartial(qa.algebra.MathExpression.EFunction(name1,[arg]));
			}
		});
		(function(name1,args,state) {
			if(args.length != 1) throw "Invalid function argument count";
			var arg = qa.algebra.AlgebraEvaluator["eval"](args[0],state);
			switch(arg[1]) {
			case 0:
				switch(arg[2][1]) {
				case 0:
					var c = arg[2][2];
					{
						var _g = qa.algebra.Algebra.changeRank(c,qa.algebra.Constant.CReal(0));
						switch(_g[1]) {
						case 2:
							var n = _g[2];
							return qa.algebra.MathExpression.ESymbol(qa.algebra.Symbol.SConst(qa.algebra.Constant.CReal(f(n))));
						default:
							throw "Unable to change constant rank";
						}
					}
					break;
				default:
					return qa.algebra.MathExpression.EPartial(qa.algebra.MathExpression.EFunction(name1,[arg]));
				}
				break;
			default:
				return qa.algebra.MathExpression.EPartial(qa.algebra.MathExpression.EFunction(name1,[arg]));
			}
		});
	}
	,addStep: function(type) {
		this.steps.push({ type : type, level : this.currentLevel});
	}
	,clearSteps: function() {
		this.steps.splice(0,this.steps.length);
	}
	,__class__: qa.algebra.EvalState
};
qa.algebra.AlgebraEvaluator = function() { };
$hxClasses["qa.algebra.AlgebraEvaluator"] = qa.algebra.AlgebraEvaluator;
qa.algebra.AlgebraEvaluator.__name__ = ["qa","algebra","AlgebraEvaluator"];
qa.algebra.AlgebraEvaluator.accumulateVariables = function(e,vars) {
	switch(e[1]) {
	case 0:
		switch(e[2][1]) {
		case 1:
			var name = e[2][2];
			if(HxOverrides.indexOf(vars,name,0) == -1) vars.push(name);
			break;
		case 0:
			break;
		}
		break;
	case 5:
		var args = e[3];
		var _g = 0;
		while(_g < args.length) {
			var arg = args[_g];
			++_g;
			qa.algebra.AlgebraEvaluator.accumulateVariables(arg,vars);
		}
		break;
	case 4:
		var e1 = e[2];
		qa.algebra.AlgebraEvaluator.accumulateVariables(e1,vars);
		break;
	case 2:
		var e1 = e[2];
		qa.algebra.AlgebraEvaluator.accumulateVariables(e1,vars);
		break;
	case 3:
		var e1 = e[2];
		qa.algebra.AlgebraEvaluator.accumulateVariables(e1,vars);
		break;
	case 1:
		var e2 = e[4];
		var e11 = e[3];
		qa.algebra.AlgebraEvaluator.accumulateVariables(e11,vars);
		qa.algebra.AlgebraEvaluator.accumulateVariables(e2,vars);
		break;
	}
};
qa.algebra.AlgebraEvaluator["eval"] = function(e,state) {
	state.currentLevel++;
	switch(e[1]) {
	case 0:case 2:
		break;
	default:
		state.addStep(qa.algebra.EvalStepType.Expression(e));
	}
	var result;
	switch(e[1]) {
	case 5:
		var args = e[3];
		var name = e[2];
		var map = state.functionMap.get(name);
		if(map == null) result = qa.algebra.MathExpression.EPartial(e); else result = map(name,args,state);
		break;
	case 4:
		var partial = e[2];
		if(state.evalPartial) return qa.algebra.AlgebraEvaluator["eval"](partial,state); else return e;
		break;
	case 0:
		var v = e[2];
		switch(e[2][1]) {
		case 0:
			var c = e[2][2];
			result = e;
			break;
		case 1:
			var name1 = e[2][2];
			var bound = state.boundVars.get(name1);
			if(bound == null) {
				state.addStep(qa.algebra.EvalStepType.UnknownSymbol(v));
				result = e;
			} else result = qa.algebra.MathExpression.ESymbol(qa.algebra.Symbol.SConst(bound));
			break;
		}
		break;
	case 1:
		var e2 = e[4];
		var e1 = e[3];
		var op = e[2];
		switch(e1[1]) {
		case 0:
			switch(e1[2][1]) {
			case 0:
				switch(e2[1]) {
				case 0:
					switch(e2[2][1]) {
					case 0:
						var ca = e1[2][2];
						var cb = e2[2][2];
						{
							var a = ca;
							switch(ca[1]) {
							case 0:
								var b = cb;
								switch(cb[1]) {
								case 0:
									var a1 = ca[2];
									var opa = ca[3];
									var opb = cb[3];
									var b1 = cb[2];
									var format;
									switch(opa[1]) {
									case 2:
										switch(opb[1]) {
										case 2:
											format = qa.arithmetic.NumberFormat.Hexadecimal;
											break;
										case 1:
											format = qa.arithmetic.NumberFormat.Decimal;
											break;
										default:
											format = qa.arithmetic.NumberFormat.None;
										}
										break;
									case 1:
										switch(opb[1]) {
										case 2:case 1:
											format = qa.arithmetic.NumberFormat.Decimal;
											break;
										default:
											format = qa.arithmetic.NumberFormat.None;
										}
										break;
									default:
										format = qa.arithmetic.NumberFormat.None;
									}
									result = qa.algebra.MathExpression.ESymbol(qa.algebra.Symbol.SConst((function($this) {
										var $r;
										switch(op[1]) {
										case 0:
											$r = qa.algebra.Constant.CInteger(qa.arithmetic._Arithmetic.Integer_Impl_.add(a1,b1),format);
											break;
										case 1:
											$r = qa.algebra.Constant.CInteger(qa.arithmetic._Arithmetic.Integer_Impl_.subtract(a1,b1),format);
											break;
										case 2:
											$r = qa.algebra.Constant.CInteger(qa.arithmetic._Arithmetic.Integer_Impl_.multiply(a1,b1),format);
											break;
										case 3:
											$r = qa.algebra.Constant.CRational(qa.arithmetic._Arithmetic.Integer_Impl_.divide(a1,b1));
											break;
										case 4:
											$r = qa.algebra.Constant.CInteger((function($this) {
												var $r;
												var f = Math.pow(a1,b1);
												if(!Math.isFinite(f)) throw new qa.arithmetic.ArithmeticError(qa.arithmetic.ArithmeticErrorType.Overflow);
												$r = Math.floor(f);
												return $r;
											}($this)),qa.arithmetic.NumberFormat.None);
											break;
										}
										return $r;
									}(this))));
									break;
								case 3:
									var c1 = cb[2];
									result = qa.algebra.AlgebraEvaluator["eval"](qa.algebra.MathExpression.EBinop(op,e1,qa.algebra.MathExpression.ESymbol(qa.algebra.Symbol.SConst(c1))),state);
									break;
								default:
									var ra = qa.algebra.Algebra.getConstantRank(a);
									var rb = qa.algebra.Algebra.getConstantRank(b);
									if(ra == rb) throw "Unimplemented binop " + Std.string(op) + " " + Std.string(e1) + " " + Std.string(e2);
									result = qa.algebra.AlgebraEvaluator["eval"](rb > ra?qa.algebra.MathExpression.EBinop(op,qa.algebra.MathExpression.ESymbol(qa.algebra.Symbol.SConst(qa.algebra.Algebra.changeRank(a,b,state))),e2):qa.algebra.MathExpression.EBinop(op,e1,qa.algebra.MathExpression.ESymbol(qa.algebra.Symbol.SConst(qa.algebra.Algebra.changeRank(b,a,state)))),state);
								}
								break;
							case 1:
								var b = cb;
								switch(cb[1]) {
								case 1:
									var a2 = ca[2];
									var b2 = cb[2];
									result = qa.algebra.MathExpression.ESymbol(qa.algebra.Symbol.SConst((function($this) {
										var $r;
										switch(op[1]) {
										case 0:
											$r = qa.algebra.Constant.CRational(qa.arithmetic._Arithmetic.SimpleFraction_Impl_.add(a2,b2));
											break;
										case 1:
											$r = qa.algebra.Constant.CRational(qa.arithmetic._Arithmetic.SimpleFraction_Impl_.subtract(a2,b2));
											break;
										case 2:
											$r = qa.algebra.Constant.CRational(qa.arithmetic._Arithmetic.SimpleFraction_Impl_.multiply(a2,b2));
											break;
										case 3:
											$r = qa.algebra.Constant.CRational(qa.arithmetic._Arithmetic.SimpleFraction_Impl_.divide(a2,b2));
											break;
										case 4:
											$r = qa.algebra.Constant.CRational((function($this) {
												var $r;
												var va = a2;
												var vb = b2;
												if(vb.b != 1) throw new qa.arithmetic.ArithmeticError(qa.arithmetic.ArithmeticErrorType.UnsupportedOperation("Fractional powers not supported"));
												var r = { a : (function($this) {
													var $r;
													var f1 = Math.pow(va.a,vb.a);
													if(!Math.isFinite(f1)) throw new qa.arithmetic.ArithmeticError(qa.arithmetic.ArithmeticErrorType.Overflow);
													$r = Math.floor(f1);
													return $r;
												}($this)), b : (function($this) {
													var $r;
													var f11 = Math.pow(va.b,vb.a);
													if(!Math.isFinite(f11)) throw new qa.arithmetic.ArithmeticError(qa.arithmetic.ArithmeticErrorType.Overflow);
													$r = Math.floor(f11);
													return $r;
												}($this))};
												qa.arithmetic._Arithmetic.SimpleFraction_Impl_.post(r);
												$r = r;
												return $r;
											}($this)));
											break;
										}
										return $r;
									}(this))));
									break;
								case 3:
									var c1 = cb[2];
									result = qa.algebra.AlgebraEvaluator["eval"](qa.algebra.MathExpression.EBinop(op,e1,qa.algebra.MathExpression.ESymbol(qa.algebra.Symbol.SConst(c1))),state);
									break;
								default:
									var ra = qa.algebra.Algebra.getConstantRank(a);
									var rb = qa.algebra.Algebra.getConstantRank(b);
									if(ra == rb) throw "Unimplemented binop " + Std.string(op) + " " + Std.string(e1) + " " + Std.string(e2);
									result = qa.algebra.AlgebraEvaluator["eval"](rb > ra?qa.algebra.MathExpression.EBinop(op,qa.algebra.MathExpression.ESymbol(qa.algebra.Symbol.SConst(qa.algebra.Algebra.changeRank(a,b,state))),e2):qa.algebra.MathExpression.EBinop(op,e1,qa.algebra.MathExpression.ESymbol(qa.algebra.Symbol.SConst(qa.algebra.Algebra.changeRank(b,a,state)))),state);
								}
								break;
							case 2:
								var b = cb;
								switch(cb[1]) {
								case 2:
									var a3 = ca[2];
									var b3 = cb[2];
									result = qa.algebra.MathExpression.ESymbol(qa.algebra.Symbol.SConst((function($this) {
										var $r;
										switch(op[1]) {
										case 0:
											$r = qa.algebra.Constant.CReal(qa.arithmetic._Arithmetic.Real_Impl_.add(a3,b3));
											break;
										case 1:
											$r = qa.algebra.Constant.CReal(qa.arithmetic._Arithmetic.Real_Impl_.subtract(a3,b3));
											break;
										case 2:
											$r = qa.algebra.Constant.CReal(qa.arithmetic._Arithmetic.Real_Impl_.multiply(a3,b3));
											break;
										case 3:
											$r = qa.algebra.Constant.CReal(qa.arithmetic._Arithmetic.Real_Impl_.divide(a3,b3));
											break;
										case 4:
											$r = qa.algebra.Constant.CReal(Math.pow(a3,b3));
											break;
										}
										return $r;
									}(this))));
									break;
								case 3:
									var c1 = cb[2];
									result = qa.algebra.AlgebraEvaluator["eval"](qa.algebra.MathExpression.EBinop(op,e1,qa.algebra.MathExpression.ESymbol(qa.algebra.Symbol.SConst(c1))),state);
									break;
								default:
									var ra = qa.algebra.Algebra.getConstantRank(a);
									var rb = qa.algebra.Algebra.getConstantRank(b);
									if(ra == rb) throw "Unimplemented binop " + Std.string(op) + " " + Std.string(e1) + " " + Std.string(e2);
									result = qa.algebra.AlgebraEvaluator["eval"](rb > ra?qa.algebra.MathExpression.EBinop(op,qa.algebra.MathExpression.ESymbol(qa.algebra.Symbol.SConst(qa.algebra.Algebra.changeRank(a,b,state))),e2):qa.algebra.MathExpression.EBinop(op,e1,qa.algebra.MathExpression.ESymbol(qa.algebra.Symbol.SConst(qa.algebra.Algebra.changeRank(b,a,state)))),state);
								}
								break;
							case 3:
								var c2 = ca[2];
								result = qa.algebra.AlgebraEvaluator["eval"](qa.algebra.MathExpression.EBinop(op,qa.algebra.MathExpression.ESymbol(qa.algebra.Symbol.SConst(c2)),e2),state);
								break;
							}
						}
						break;
					default:
						var ev1 = qa.algebra.AlgebraEvaluator["eval"](e1,state);
						var ev2 = qa.algebra.AlgebraEvaluator["eval"](e2,state);
						switch(ev1[1]) {
						case 0:
							switch(ev1[2][1]) {
							case 0:
								switch(ev2[1]) {
								case 0:
									switch(ev2[2][1]) {
									case 0:
										var a4 = ev1[2][2];
										var b4 = ev2[2][2];
										result = qa.algebra.AlgebraEvaluator["eval"](qa.algebra.MathExpression.EBinop(op,ev1,ev2),state);
										break;
									default:
										result = qa.algebra.MathExpression.EPartial(qa.algebra.MathExpression.EBinop(op,ev1,ev2));
									}
									break;
								default:
									result = qa.algebra.MathExpression.EPartial(qa.algebra.MathExpression.EBinop(op,ev1,ev2));
								}
								break;
							default:
								result = qa.algebra.MathExpression.EPartial(qa.algebra.MathExpression.EBinop(op,ev1,ev2));
							}
							break;
						default:
							result = qa.algebra.MathExpression.EPartial(qa.algebra.MathExpression.EBinop(op,ev1,ev2));
						}
					}
					break;
				default:
					var ev1 = qa.algebra.AlgebraEvaluator["eval"](e1,state);
					var ev2 = qa.algebra.AlgebraEvaluator["eval"](e2,state);
					switch(ev1[1]) {
					case 0:
						switch(ev1[2][1]) {
						case 0:
							switch(ev2[1]) {
							case 0:
								switch(ev2[2][1]) {
								case 0:
									var a4 = ev1[2][2];
									var b4 = ev2[2][2];
									result = qa.algebra.AlgebraEvaluator["eval"](qa.algebra.MathExpression.EBinop(op,ev1,ev2),state);
									break;
								default:
									result = qa.algebra.MathExpression.EPartial(qa.algebra.MathExpression.EBinop(op,ev1,ev2));
								}
								break;
							default:
								result = qa.algebra.MathExpression.EPartial(qa.algebra.MathExpression.EBinop(op,ev1,ev2));
							}
							break;
						default:
							result = qa.algebra.MathExpression.EPartial(qa.algebra.MathExpression.EBinop(op,ev1,ev2));
						}
						break;
					default:
						result = qa.algebra.MathExpression.EPartial(qa.algebra.MathExpression.EBinop(op,ev1,ev2));
					}
				}
				break;
			default:
				var ev1 = qa.algebra.AlgebraEvaluator["eval"](e1,state);
				var ev2 = qa.algebra.AlgebraEvaluator["eval"](e2,state);
				switch(ev1[1]) {
				case 0:
					switch(ev1[2][1]) {
					case 0:
						switch(ev2[1]) {
						case 0:
							switch(ev2[2][1]) {
							case 0:
								var a4 = ev1[2][2];
								var b4 = ev2[2][2];
								result = qa.algebra.AlgebraEvaluator["eval"](qa.algebra.MathExpression.EBinop(op,ev1,ev2),state);
								break;
							default:
								result = qa.algebra.MathExpression.EPartial(qa.algebra.MathExpression.EBinop(op,ev1,ev2));
							}
							break;
						default:
							result = qa.algebra.MathExpression.EPartial(qa.algebra.MathExpression.EBinop(op,ev1,ev2));
						}
						break;
					default:
						result = qa.algebra.MathExpression.EPartial(qa.algebra.MathExpression.EBinop(op,ev1,ev2));
					}
					break;
				default:
					result = qa.algebra.MathExpression.EPartial(qa.algebra.MathExpression.EBinop(op,ev1,ev2));
				}
			}
			break;
		default:
			var ev1 = qa.algebra.AlgebraEvaluator["eval"](e1,state);
			var ev2 = qa.algebra.AlgebraEvaluator["eval"](e2,state);
			switch(ev1[1]) {
			case 0:
				switch(ev1[2][1]) {
				case 0:
					switch(ev2[1]) {
					case 0:
						switch(ev2[2][1]) {
						case 0:
							var a4 = ev1[2][2];
							var b4 = ev2[2][2];
							result = qa.algebra.AlgebraEvaluator["eval"](qa.algebra.MathExpression.EBinop(op,ev1,ev2),state);
							break;
						default:
							result = qa.algebra.MathExpression.EPartial(qa.algebra.MathExpression.EBinop(op,ev1,ev2));
						}
						break;
					default:
						result = qa.algebra.MathExpression.EPartial(qa.algebra.MathExpression.EBinop(op,ev1,ev2));
					}
					break;
				default:
					result = qa.algebra.MathExpression.EPartial(qa.algebra.MathExpression.EBinop(op,ev1,ev2));
				}
				break;
			default:
				result = qa.algebra.MathExpression.EPartial(qa.algebra.MathExpression.EBinop(op,ev1,ev2));
			}
		}
		break;
	case 2:
		var e3 = e[2];
		result = qa.algebra.AlgebraEvaluator["eval"](e3,state);
		break;
	case 3:
		var e4 = e[2];
		switch(e4[1]) {
		case 0:
			switch(e4[2][1]) {
			case 0:
				var c3 = e4[2][2];
				switch(c3[1]) {
				case 3:
					var m = c3[2];
					c3 = m;
					break;
				default:
				}
				result = qa.algebra.MathExpression.ESymbol(qa.algebra.Symbol.SConst((function($this) {
					var $r;
					switch(c3[1]) {
					case 0:
						$r = (function($this) {
							var $r;
							var format1 = c3[3];
							var n = c3[2];
							$r = qa.algebra.Constant.CInteger(-n,format1);
							return $r;
						}($this));
						break;
					case 1:
						$r = (function($this) {
							var $r;
							var n1 = c3[2];
							$r = qa.algebra.Constant.CRational(qa.arithmetic._Arithmetic.SimpleFraction_Impl_.subtract(qa.arithmetic._Arithmetic.SimpleFraction_Impl_.ZERO,n1));
							return $r;
						}($this));
						break;
					case 2:
						$r = (function($this) {
							var $r;
							var n2 = c3[2];
							$r = qa.algebra.Constant.CReal(-n2);
							return $r;
						}($this));
						break;
					case 3:
						$r = (function($this) {
							var $r;
							throw "Internal error trying to negate mathematical constant";
							return $r;
						}($this));
						break;
					}
					return $r;
				}(this))));
				break;
			default:
				if((function($this) {
					var $r;
					switch(e4[1]) {
					case 0:
						$r = (function($this) {
							var $r;
							switch(e4[2][1]) {
							case 0:
								$r = true;
								break;
							default:
								$r = false;
							}
							return $r;
						}($this));
						break;
					default:
						$r = false;
					}
					return $r;
				}(this))) throw "Unimplemented negation " + Std.string(e4);
				var ev = qa.algebra.AlgebraEvaluator["eval"](e4,state);
				switch(ev[1]) {
				case 0:
					switch(ev[2][1]) {
					case 0:
						var c4 = ev[2][2];
						result = qa.algebra.AlgebraEvaluator["eval"](qa.algebra.MathExpression.ENeg(ev),state);
						break;
					default:
						result = qa.algebra.MathExpression.EPartial(qa.algebra.MathExpression.ENeg(ev));
					}
					break;
				default:
					result = qa.algebra.MathExpression.EPartial(qa.algebra.MathExpression.ENeg(ev));
				}
			}
			break;
		default:
			if((function($this) {
				var $r;
				switch(e4[1]) {
				case 0:
					$r = (function($this) {
						var $r;
						switch(e4[2][1]) {
						case 0:
							$r = true;
							break;
						default:
							$r = false;
						}
						return $r;
					}($this));
					break;
				default:
					$r = false;
				}
				return $r;
			}(this))) throw "Unimplemented negation " + Std.string(e4);
			var ev = qa.algebra.AlgebraEvaluator["eval"](e4,state);
			switch(ev[1]) {
			case 0:
				switch(ev[2][1]) {
				case 0:
					var c4 = ev[2][2];
					result = qa.algebra.AlgebraEvaluator["eval"](qa.algebra.MathExpression.ENeg(ev),state);
					break;
				default:
					result = qa.algebra.MathExpression.EPartial(qa.algebra.MathExpression.ENeg(ev));
				}
				break;
			default:
				result = qa.algebra.MathExpression.EPartial(qa.algebra.MathExpression.ENeg(ev));
			}
		}
		break;
	}
	state.currentLevel--;
	switch(e[1]) {
	case 0:case 2:
		break;
	default:
		state.addStep(qa.algebra.EvalStepType.Result(result));
	}
	return result;
};
qa.algebra.AlgebraToken = $hxClasses["qa.algebra.AlgebraToken"] = { __ename__ : ["qa","algebra","AlgebraToken"], __constructs__ : ["TSymbol","TPOpen","TPClose","TComma","TBinop","TEof"] };
qa.algebra.AlgebraToken.TSymbol = function(c) { var $x = ["TSymbol",0,c]; $x.__enum__ = qa.algebra.AlgebraToken; $x.toString = $estr; return $x; };
qa.algebra.AlgebraToken.TPOpen = ["TPOpen",1];
qa.algebra.AlgebraToken.TPOpen.toString = $estr;
qa.algebra.AlgebraToken.TPOpen.__enum__ = qa.algebra.AlgebraToken;
qa.algebra.AlgebraToken.TPClose = ["TPClose",2];
qa.algebra.AlgebraToken.TPClose.toString = $estr;
qa.algebra.AlgebraToken.TPClose.__enum__ = qa.algebra.AlgebraToken;
qa.algebra.AlgebraToken.TComma = ["TComma",3];
qa.algebra.AlgebraToken.TComma.toString = $estr;
qa.algebra.AlgebraToken.TComma.__enum__ = qa.algebra.AlgebraToken;
qa.algebra.AlgebraToken.TBinop = function(op) { var $x = ["TBinop",4,op]; $x.__enum__ = qa.algebra.AlgebraToken; $x.toString = $estr; return $x; };
qa.algebra.AlgebraToken.TEof = ["TEof",5];
qa.algebra.AlgebraToken.TEof.toString = $estr;
qa.algebra.AlgebraToken.TEof.__enum__ = qa.algebra.AlgebraToken;
qa.arithmetic = {};
qa.arithmetic._Arithmetic = {};
qa.arithmetic._Arithmetic.Integer_Impl_ = function() { };
$hxClasses["qa.arithmetic._Arithmetic.Integer_Impl_"] = qa.arithmetic._Arithmetic.Integer_Impl_;
qa.arithmetic._Arithmetic.Integer_Impl_.__name__ = ["qa","arithmetic","_Arithmetic","Integer_Impl_"];
qa.arithmetic._Arithmetic.Integer_Impl_.fromString = function(s) {
	var n = Std.parseInt(s);
	if(n == null) throw "Unable to convert from String to Integer: " + s;
	var t = n;
	return js.Boot.__cast(t , Int);
};
qa.arithmetic._Arithmetic.Integer_Impl_.toString = function(n) {
	return "" + n;
};
qa.arithmetic._Arithmetic.Integer_Impl_.toSimpleFraction = function(n) {
	return { a : n, b : 1};
};
qa.arithmetic._Arithmetic.Integer_Impl_.negate = function(n) {
	return -n;
};
qa.arithmetic._Arithmetic.Integer_Impl_.abs = function(n) {
	if(qa.arithmetic._Arithmetic.Integer_Impl_.lessThan(n,0)) return -n; else return n;
};
qa.arithmetic._Arithmetic.Integer_Impl_.divideInteger = function(a,b) {
	return Math.floor(a / b);
};
qa.arithmetic._Arithmetic.Integer_Impl_.pow = function(a,b) {
	var f = Math.pow(a,b);
	if(!Math.isFinite(f)) throw new qa.arithmetic.ArithmeticError(qa.arithmetic.ArithmeticErrorType.Overflow);
	return Math.floor(f);
};
qa.arithmetic._Arithmetic.Integer_Impl_.toReal = function(n) {
	return n;
};
qa.arithmetic._Arithmetic.Integer_Impl_.add = function(a,b) {
	return a + b;
};
qa.arithmetic._Arithmetic.Integer_Impl_.subtract = function(a,b) {
	return a - b;
};
qa.arithmetic._Arithmetic.Integer_Impl_.multiply = function(a,b) {
	return a * b;
};
qa.arithmetic._Arithmetic.Integer_Impl_.divide = function(a,b) {
	var f = { a : a, b : b};
	qa.arithmetic._Arithmetic.SimpleFraction_Impl_.simplify(f);
	return f;
};
qa.arithmetic._Arithmetic.Integer_Impl_.greaterThan = function(a,b) {
	return a > b;
};
qa.arithmetic._Arithmetic.Integer_Impl_.lessThan = function(a,b) {
	return a < b;
};
qa.arithmetic.NumberFormat = $hxClasses["qa.arithmetic.NumberFormat"] = { __ename__ : ["qa","arithmetic","NumberFormat"], __constructs__ : ["None","Decimal","Hexadecimal"] };
qa.arithmetic.NumberFormat.None = ["None",0];
qa.arithmetic.NumberFormat.None.toString = $estr;
qa.arithmetic.NumberFormat.None.__enum__ = qa.arithmetic.NumberFormat;
qa.arithmetic.NumberFormat.Decimal = ["Decimal",1];
qa.arithmetic.NumberFormat.Decimal.toString = $estr;
qa.arithmetic.NumberFormat.Decimal.__enum__ = qa.arithmetic.NumberFormat;
qa.arithmetic.NumberFormat.Hexadecimal = ["Hexadecimal",2];
qa.arithmetic.NumberFormat.Hexadecimal.toString = $estr;
qa.arithmetic.NumberFormat.Hexadecimal.__enum__ = qa.arithmetic.NumberFormat;
qa.arithmetic._Arithmetic.Real_Impl_ = function() { };
$hxClasses["qa.arithmetic._Arithmetic.Real_Impl_"] = qa.arithmetic._Arithmetic.Real_Impl_;
qa.arithmetic._Arithmetic.Real_Impl_.__name__ = ["qa","arithmetic","_Arithmetic","Real_Impl_"];
qa.arithmetic._Arithmetic.Real_Impl_.fromString = function(s) {
	var n = Std.parseFloat(s);
	if(Math.isNaN(n)) throw "Unable to convert from String to Float: " + s;
	return js.Boot.__cast(n , Float);
};
qa.arithmetic._Arithmetic.Real_Impl_.toString = function(n) {
	return "" + n;
};
qa.arithmetic._Arithmetic.Real_Impl_.negate = function(n) {
	return -n;
};
qa.arithmetic._Arithmetic.Real_Impl_.abs = function(n) {
	if(qa.arithmetic._Arithmetic.Real_Impl_.lessThan(n,0)) return -n; else return n;
};
qa.arithmetic._Arithmetic.Real_Impl_.pow = function(a,b) {
	return Math.pow(a,b);
};
qa.arithmetic._Arithmetic.Real_Impl_.add = function(a,b) {
	return a + b;
};
qa.arithmetic._Arithmetic.Real_Impl_.subtract = function(a,b) {
	return a - b;
};
qa.arithmetic._Arithmetic.Real_Impl_.multiply = function(a,b) {
	return a * b;
};
qa.arithmetic._Arithmetic.Real_Impl_.divide = function(a,b) {
	return a / b;
};
qa.arithmetic._Arithmetic.Real_Impl_.greaterThan = function(a,b) {
	return a > b;
};
qa.arithmetic._Arithmetic.Real_Impl_.lessThan = function(a,b) {
	return a < b;
};
qa.algebra.AlgebraLexer = function() {
	hxparse.Lexer.call(this,null);
};
$hxClasses["qa.algebra.AlgebraLexer"] = qa.algebra.AlgebraLexer;
qa.algebra.AlgebraLexer.__name__ = ["qa","algebra","AlgebraLexer"];
qa.algebra.AlgebraLexer.__interfaces__ = [hxparse.RuleBuilder];
qa.algebra.AlgebraLexer.__super__ = hxparse.Lexer;
qa.algebra.AlgebraLexer.prototype = $extend(hxparse.Lexer.prototype,{
	reset: function(input,sourceName) {
		if(sourceName == null) sourceName = "<input>";
		this.current = "";
		this.input = input;
		this.source = sourceName;
		this.pos = 0;
	}
	,__class__: qa.algebra.AlgebraLexer
});
qa.algebra.AlgebraParser = function(stream,ruleset) {
	this.steps = new Array();
	hxparse.Parser_qa_algebra_AlgebraLexer_qa_algebra_AlgebraToken.call(this,stream,ruleset);
};
$hxClasses["qa.algebra.AlgebraParser"] = qa.algebra.AlgebraParser;
qa.algebra.AlgebraParser.__name__ = ["qa","algebra","AlgebraParser"];
qa.algebra.AlgebraParser.__interfaces__ = [hxparse.ParserBuilder];
qa.algebra.AlgebraParser.__super__ = hxparse.Parser_qa_algebra_AlgebraLexer_qa_algebra_AlgebraToken;
qa.algebra.AlgebraParser.prototype = $extend(hxparse.Parser_qa_algebra_AlgebraLexer_qa_algebra_AlgebraToken.prototype,{
	steps: null
	,reset: function() {
		this.token = null;
		this.steps.splice(0,this.steps.length);
	}
	,step: function(msg) {
		this.steps.push(msg);
	}
	,peek: function(n) {
		var t = hxparse.Parser_qa_algebra_AlgebraLexer_qa_algebra_AlgebraToken.prototype.peek.call(this,n);
		this.step("peek(" + n + "): " + Std.string(t));
		return t;
	}
	,parse: function() {
		this.steps.push("parse");
		var e;
		{
			var _g = this.peek(0);
			switch(_g[1]) {
			case 4:
				switch(_g[2][1]) {
				case 1:
					this.last = this.token.elt;
					this.token = this.token.next;
					var e1 = this.parseElement();
					e = this.parseNext(qa.algebra.MathExpression.ENeg(e1));
					break;
				default:
					e = this.parseNext(this.parseElement());
				}
				break;
			default:
				e = this.parseNext(this.parseElement());
			}
		}
		this.step("postparse " + Std.string(this.peek(0)));
		return e;
	}
	,parseElement: function() {
		this.steps.push("parseElement");
		{
			var _g = this.peek(0);
			switch(_g[1]) {
			case 0:
				var c = _g[2];
				this.last = this.token.elt;
				this.token = this.token.next;
				var _g1 = this.peek(0);
				switch(_g1[1]) {
				case 1:
					this.last = this.token.elt;
					this.token = this.token.next;
					var args = this.parseArguments();
					var _g2 = this.peek(0);
					switch(_g2[1]) {
					case 2:
						this.last = this.token.elt;
						this.token = this.token.next;
						switch(c[1]) {
						case 1:
							var name = c[2];
							this.steps.push("function " + name);
							return qa.algebra.MathExpression.EFunction(name,args);
						default:
							throw "Unsupported parenthesis after constant";
						}
						break;
					default:
						throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
					}
					break;
				default:
					this.step("symbol " + Std.string(c));
					return qa.algebra.MathExpression.ESymbol(c);
				}
				break;
			case 1:
				this.last = this.token.elt;
				this.token = this.token.next;
				var e = this.parse();
				var _g11 = this.peek(0);
				switch(_g11[1]) {
				case 2:
					this.last = this.token.elt;
					this.token = this.token.next;
					this.step("paren " + Std.string(e));
					return qa.algebra.MathExpression.EParenthesis(e);
				default:
					throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
				}
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,parseArguments: function() {
		this.steps.push("parseArguments");
		var args = new Array();
		try {
			while(true) {
				this.steps.push("parsing argument");
				args.push(this.parse());
				this.steps.push("parsed argument");
				var _g = this.peek(0);
				switch(_g[1]) {
				case 3:
					this.last = this.token.elt;
					this.token = this.token.next;
					null;
					break;
				default:
					throw "__break__";
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		return args;
	}
	,parseNext: function(e1) {
		this.steps.push("parseNext");
		{
			var _g = this.peek(0);
			switch(_g[1]) {
			case 4:
				var op = _g[2];
				this.last = this.token.elt;
				this.token = this.token.next;
				var e2 = this.parse();
				return this.binop(op,e1,e2);
			default:
				this.step("pass " + Std.string(e1));
				return e1;
			}
		}
	}
	,binop: function(op,e1,e2) {
		this.step("B " + Std.string(op));
		this.step(qa.algebra.AlgebraPrinter.printTexInline(e1));
		this.step(qa.algebra.AlgebraPrinter.printTexInline(e2));
		var ret;
		switch(e1[1]) {
		case 3:
			var en = e1[2];
			if((function($this) {
				var $r;
				switch(op[1]) {
				case 4:
					$r = true;
					break;
				default:
					$r = false;
				}
				return $r;
			}(this))) ret = qa.algebra.MathExpression.ENeg(qa.algebra.MathExpression.EBinop(qa.algebra.AlgebraBinop.OpPow,en,e2)); else switch(e2[1]) {
			case 1:
				var e22 = e2[4];
				var e21 = e2[3];
				var e2op = e2[2];
				if(qa.algebra.Algebra.getPrecedenceRank(op) > qa.algebra.Algebra.getPrecedenceRank(e2op)) {
					this.step("binopswitch " + Std.string(e2op) + " " + Std.string(e21) + " " + Std.string(e22));
					ret = qa.algebra.MathExpression.EBinop(e2op,this.binop(op,e1,e21),e22);
				} else {
					this.step("binoppass " + Std.string(e1) + " " + Std.string(op) + " " + Std.string(e2));
					ret = qa.algebra.MathExpression.EBinop(op,e1,e2);
				}
				break;
			default:
				this.step("binoppass " + Std.string(e1) + " " + Std.string(op) + " " + Std.string(e2));
				ret = qa.algebra.MathExpression.EBinop(op,e1,e2);
			}
			break;
		default:
			switch(e2[1]) {
			case 1:
				var e22 = e2[4];
				var e21 = e2[3];
				var e2op = e2[2];
				if(qa.algebra.Algebra.getPrecedenceRank(op) > qa.algebra.Algebra.getPrecedenceRank(e2op)) {
					this.step("binopswitch " + Std.string(e2op) + " " + Std.string(e21) + " " + Std.string(e22));
					ret = qa.algebra.MathExpression.EBinop(e2op,this.binop(op,e1,e21),e22);
				} else {
					this.step("binoppass " + Std.string(e1) + " " + Std.string(op) + " " + Std.string(e2));
					ret = qa.algebra.MathExpression.EBinop(op,e1,e2);
				}
				break;
			default:
				this.step("binoppass " + Std.string(e1) + " " + Std.string(op) + " " + Std.string(e2));
				ret = qa.algebra.MathExpression.EBinop(op,e1,e2);
			}
		}
		return ret;
	}
	,__class__: qa.algebra.AlgebraParser
});
qa.arithmetic.ArithmeticError = function(type) {
	this.type = type;
};
$hxClasses["qa.arithmetic.ArithmeticError"] = qa.arithmetic.ArithmeticError;
qa.arithmetic.ArithmeticError.__name__ = ["qa","arithmetic","ArithmeticError"];
qa.arithmetic.ArithmeticError.prototype = {
	type: null
	,__class__: qa.arithmetic.ArithmeticError
};
qa.arithmetic.ArithmeticErrorType = $hxClasses["qa.arithmetic.ArithmeticErrorType"] = { __ename__ : ["qa","arithmetic","ArithmeticErrorType"], __constructs__ : ["DivisionByZero","UnsupportedOperation","Overflow"] };
qa.arithmetic.ArithmeticErrorType.DivisionByZero = ["DivisionByZero",0];
qa.arithmetic.ArithmeticErrorType.DivisionByZero.toString = $estr;
qa.arithmetic.ArithmeticErrorType.DivisionByZero.__enum__ = qa.arithmetic.ArithmeticErrorType;
qa.arithmetic.ArithmeticErrorType.UnsupportedOperation = function(msg) { var $x = ["UnsupportedOperation",1,msg]; $x.__enum__ = qa.arithmetic.ArithmeticErrorType; $x.toString = $estr; return $x; };
qa.arithmetic.ArithmeticErrorType.Overflow = ["Overflow",2];
qa.arithmetic.ArithmeticErrorType.Overflow.toString = $estr;
qa.arithmetic.ArithmeticErrorType.Overflow.__enum__ = qa.arithmetic.ArithmeticErrorType;
qa.arithmetic._Arithmetic.SimpleFraction_Impl_ = function() { };
$hxClasses["qa.arithmetic._Arithmetic.SimpleFraction_Impl_"] = qa.arithmetic._Arithmetic.SimpleFraction_Impl_;
qa.arithmetic._Arithmetic.SimpleFraction_Impl_.__name__ = ["qa","arithmetic","_Arithmetic","SimpleFraction_Impl_"];
qa.arithmetic._Arithmetic.SimpleFraction_Impl_.toReal = function(n) {
	var v = n;
	return qa.arithmetic._Arithmetic.Real_Impl_.divide(qa.arithmetic._Arithmetic.Integer_Impl_.toReal(v.a),qa.arithmetic._Arithmetic.Integer_Impl_.toReal(v.b));
};
qa.arithmetic._Arithmetic.SimpleFraction_Impl_.getNumerator = function(this1) {
	return this1.a;
};
qa.arithmetic._Arithmetic.SimpleFraction_Impl_.getDenominator = function(this1) {
	return this1.b;
};
qa.arithmetic._Arithmetic.SimpleFraction_Impl_.gcd = function(this1) {
	var d = 0;
	var r = 0;
	var a;
	var n = this1.a;
	if(qa.arithmetic._Arithmetic.Integer_Impl_.lessThan(n,0)) a = -n; else a = n;
	var b;
	var n1 = this1.b;
	if(qa.arithmetic._Arithmetic.Integer_Impl_.lessThan(n1,0)) b = -n1; else b = n1;
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
qa.arithmetic._Arithmetic.SimpleFraction_Impl_.post = function(this1) {
	qa.arithmetic._Arithmetic.SimpleFraction_Impl_.simplify(this1);
};
qa.arithmetic._Arithmetic.SimpleFraction_Impl_.simplify = function(this1) {
	qa.arithmetic._Arithmetic.SimpleFraction_Impl_.reduce(this1);
	var v = this1;
	if(qa.arithmetic._Arithmetic.Integer_Impl_.lessThan(v.a,0) && qa.arithmetic._Arithmetic.Integer_Impl_.lessThan(v.b,0)) {
		v.a = -v.a;
		v.b = -v.b;
	}
};
qa.arithmetic._Arithmetic.SimpleFraction_Impl_.reduce = function(this1) {
	var d = qa.arithmetic._Arithmetic.SimpleFraction_Impl_.gcd(this1);
	var v = this1;
	v.a = Math.floor(v.a / d);
	v.b = Math.floor(v.b / d);
};
qa.arithmetic._Arithmetic.SimpleFraction_Impl_.pow = function(a,b) {
	var va = a;
	var vb = b;
	if(vb.b != 1) throw new qa.arithmetic.ArithmeticError(qa.arithmetic.ArithmeticErrorType.UnsupportedOperation("Fractional powers not supported"));
	var r = { a : (function($this) {
		var $r;
		var f = Math.pow(va.a,vb.a);
		if(!Math.isFinite(f)) throw new qa.arithmetic.ArithmeticError(qa.arithmetic.ArithmeticErrorType.Overflow);
		$r = Math.floor(f);
		return $r;
	}(this)), b : (function($this) {
		var $r;
		var f1 = Math.pow(va.b,vb.a);
		if(!Math.isFinite(f1)) throw new qa.arithmetic.ArithmeticError(qa.arithmetic.ArithmeticErrorType.Overflow);
		$r = Math.floor(f1);
		return $r;
	}(this))};
	qa.arithmetic._Arithmetic.SimpleFraction_Impl_.post(r);
	return r;
};
qa.arithmetic._Arithmetic.SimpleFraction_Impl_.negate = function(n) {
	return qa.arithmetic._Arithmetic.SimpleFraction_Impl_.subtract(qa.arithmetic._Arithmetic.SimpleFraction_Impl_.ZERO,n);
};
qa.arithmetic._Arithmetic.SimpleFraction_Impl_.add = function(a,b) {
	var va = a;
	var vb = b;
	var r = { a : qa.arithmetic._Arithmetic.Integer_Impl_.add(qa.arithmetic._Arithmetic.Integer_Impl_.multiply(va.a,vb.b),qa.arithmetic._Arithmetic.Integer_Impl_.multiply(vb.a,va.b)), b : qa.arithmetic._Arithmetic.Integer_Impl_.multiply(va.b,vb.b)};
	qa.arithmetic._Arithmetic.SimpleFraction_Impl_.post(r);
	return r;
};
qa.arithmetic._Arithmetic.SimpleFraction_Impl_.subtract = function(a,b) {
	var va = a;
	var vb = b;
	var r = { a : qa.arithmetic._Arithmetic.Integer_Impl_.subtract(qa.arithmetic._Arithmetic.Integer_Impl_.multiply(va.a,vb.b),qa.arithmetic._Arithmetic.Integer_Impl_.multiply(vb.a,va.b)), b : qa.arithmetic._Arithmetic.Integer_Impl_.multiply(va.b,vb.b)};
	qa.arithmetic._Arithmetic.SimpleFraction_Impl_.post(r);
	return r;
};
qa.arithmetic._Arithmetic.SimpleFraction_Impl_.multiply = function(a,b) {
	var va = a;
	var vb = b;
	var r = { a : qa.arithmetic._Arithmetic.Integer_Impl_.multiply(va.a,vb.a), b : qa.arithmetic._Arithmetic.Integer_Impl_.multiply(va.b,vb.b)};
	qa.arithmetic._Arithmetic.SimpleFraction_Impl_.post(r);
	return r;
};
qa.arithmetic._Arithmetic.SimpleFraction_Impl_.divide = function(a,b) {
	var va = a;
	var vb = b;
	if(qa.arithmetic._Arithmetic.Integer_Impl_.toSimpleFraction(vb.a) == qa.arithmetic._Arithmetic.SimpleFraction_Impl_.ZERO) throw new qa.arithmetic.ArithmeticError(qa.arithmetic.ArithmeticErrorType.DivisionByZero);
	var r = { a : qa.arithmetic._Arithmetic.Integer_Impl_.multiply(va.a,vb.b), b : qa.arithmetic._Arithmetic.Integer_Impl_.multiply(va.b,vb.a)};
	qa.arithmetic._Arithmetic.SimpleFraction_Impl_.post(r);
	return r;
};
qa.providers = {};
qa.providers.Provider = function() { };
$hxClasses["qa.providers.Provider"] = qa.providers.Provider;
qa.providers.Provider.__name__ = ["qa","providers","Provider"];
qa.providers.Provider.prototype = {
	reset: null
	,query: null
	,__class__: qa.providers.Provider
};
qa.providers.AlgebraParserProvider = function() {
	this.lexer = new qa.algebra.AlgebraLexer();
	this.parser = new qa.algebra.AlgebraParser(this.lexer,qa.algebra.AlgebraLexer.tok);
};
$hxClasses["qa.providers.AlgebraParserProvider"] = qa.providers.AlgebraParserProvider;
qa.providers.AlgebraParserProvider.__name__ = ["qa","providers","AlgebraParserProvider"];
qa.providers.AlgebraParserProvider.__interfaces__ = [qa.providers.Provider];
qa.providers.AlgebraParserProvider.prototype = {
	lexer: null
	,parser: null
	,reset: function() {
	}
	,query: function(item) {
		if(Type.getClass(item) != String) return new qa.providers.StaticQuery(qa.providers.Result.None);
		var bytes = byte.js._ByteData.ByteData_Impl_.ofString(item);
		this.lexer.reset(bytes);
		this.parser.reset();
		try {
			var expr = this.parser.parse();
			return new qa.providers.StaticQuery(qa.providers.Result.Item(expr,new qa.providers.StepDisplay(qa.algebra.AlgebraPrinter.printTex(expr),this.parser.steps)));
		} catch( e ) {
			return new qa.providers.StaticQuery(qa.providers.Result.None);
		}
	}
	,__class__: qa.providers.AlgebraParserProvider
};
qa.providers.AlgebraEvalProvider = function() {
};
$hxClasses["qa.providers.AlgebraEvalProvider"] = qa.providers.AlgebraEvalProvider;
qa.providers.AlgebraEvalProvider.__name__ = ["qa","providers","AlgebraEvalProvider"];
qa.providers.AlgebraEvalProvider.__interfaces__ = [qa.providers.Provider];
qa.providers.AlgebraEvalProvider.prototype = {
	reset: function() {
	}
	,query: function(item) {
		if(Type.getEnum(item) != qa.algebra.MathExpression) return new qa.providers.StaticQuery(qa.providers.Result.None);
		var expr = item;
		return new qa.providers.StaticQuery((function($this) {
			var $r;
			switch(expr[1]) {
			case 4:
				$r = qa.providers.Result.None;
				break;
			case 0:
				$r = (function($this) {
					var $r;
					switch(expr[2][1]) {
					case 0:
						$r = qa.providers.Result.None;
						break;
					default:
						$r = (function($this) {
							var $r;
							var evalState = new qa.algebra.EvalState();
							var answer = qa.algebra.AlgebraEvaluator["eval"](expr,evalState);
							$r = (function($this) {
								var $r;
								switch(answer[1]) {
								case 0:
									$r = (function($this) {
										var $r;
										switch(answer[2][1]) {
										case 1:
											$r = qa.providers.Result.None;
											break;
										default:
											$r = qa.providers.Result.Item(answer,new qa.providers.StepDisplay(qa.algebra.AlgebraPrinter.printTex(answer),evalState.steps.map(qa.algebra.AlgebraPrinter.printEvalStep)));
										}
										return $r;
									}($this));
									break;
								default:
									$r = qa.providers.Result.Item(answer,new qa.providers.StepDisplay(qa.algebra.AlgebraPrinter.printTex(answer),evalState.steps.map(qa.algebra.AlgebraPrinter.printEvalStep)));
								}
								return $r;
							}($this));
							return $r;
						}($this));
					}
					return $r;
				}($this));
				break;
			default:
				$r = (function($this) {
					var $r;
					var evalState = new qa.algebra.EvalState();
					var answer = qa.algebra.AlgebraEvaluator["eval"](expr,evalState);
					$r = (function($this) {
						var $r;
						switch(answer[1]) {
						case 0:
							$r = (function($this) {
								var $r;
								switch(answer[2][1]) {
								case 1:
									$r = qa.providers.Result.None;
									break;
								default:
									$r = qa.providers.Result.Item(answer,new qa.providers.StepDisplay(qa.algebra.AlgebraPrinter.printTex(answer),evalState.steps.map(qa.algebra.AlgebraPrinter.printEvalStep)));
								}
								return $r;
							}($this));
							break;
						default:
							$r = qa.providers.Result.Item(answer,new qa.providers.StepDisplay(qa.algebra.AlgebraPrinter.printTex(answer),evalState.steps.map(qa.algebra.AlgebraPrinter.printEvalStep)));
						}
						return $r;
					}($this));
					return $r;
				}($this));
			}
			return $r;
		}(this)));
	}
	,__class__: qa.providers.AlgebraEvalProvider
};
qa.providers.MathBoxProvider = function() {
	this.reset();
};
$hxClasses["qa.providers.MathBoxProvider"] = qa.providers.MathBoxProvider;
qa.providers.MathBoxProvider.__name__ = ["qa","providers","MathBoxProvider"];
qa.providers.MathBoxProvider.__interfaces__ = [qa.providers.Provider];
qa.providers.MathBoxProvider.prototype = {
	queries: null
	,reset: function() {
		this.queries = 0;
	}
	,query: function(item) {
		if(Type.getEnum(item) != qa.algebra.MathExpression) return new qa.providers.StaticQuery(qa.providers.Result.None);
		var expr = item;
		return new qa.providers.StaticQuery((function($this) {
			var $r;
			switch(expr[1]) {
			case 4:
				$r = (function($this) {
					var $r;
					var id = $this.queries++;
					$r = qa.providers.Result.Item(null,new qa.providers.MathBoxDisplay(id,expr));
					return $r;
				}($this));
				break;
			default:
				$r = qa.providers.Result.None;
			}
			return $r;
		}(this)));
	}
	,__class__: qa.providers.MathBoxProvider
};
qa.providers.Display = function() { };
$hxClasses["qa.providers.Display"] = qa.providers.Display;
qa.providers.Display.__name__ = ["qa","providers","Display"];
qa.providers.Display.prototype = {
	provider: null
	,apply: function(element) {
	}
	,__class__: qa.providers.Display
};
qa.providers.MathBoxDisplay = function(id,expr) {
	this.id = id;
	this.expr = expr;
};
$hxClasses["qa.providers.MathBoxDisplay"] = qa.providers.MathBoxDisplay;
qa.providers.MathBoxDisplay.__name__ = ["qa","providers","MathBoxDisplay"];
qa.providers.MathBoxDisplay.__super__ = qa.providers.Display;
qa.providers.MathBoxDisplay.prototype = $extend(qa.providers.Display.prototype,{
	id: null
	,expr: null
	,apply: function(element) {
		var _g = this;
		var frameid = "mathbox-query-frame-" + this.id;
		var iframes = element.getElementsByTagName("iframe");
		var frame;
		if(iframes.length > 0) {
			frame = iframes[0];
			this.callMathBox(frame);
		} else {
			element.innerHTML = "\r\n\t\t\t\t<h3 class=\"provider-name\">MathBox</h3>\r\n\t\t\t\t<iframe class=\"mathbox-frame\" frameborder=\"0\" id=\"" + frameid + "\" src=\"lib/mathbox.html\"></iframe>\r\n\t\t\t";
			frame = element.getElementsByTagName("iframe")[0];
			frame.contentWindow.addEventListener("mathboxReady",function(e) {
				_g.callMathBox(frame);
			});
		}
	}
	,callMathBox: function(frame) {
		var _g1 = this;
		var primid = frame.id + "-primitive";
		var evalState = new qa.algebra.EvalState();
		evalState.evalPartial = true;
		var vars = new Array();
		qa.algebra.AlgebraEvaluator.accumulateVariables(this.expr,vars);
		var f = null;
		var _g = vars.length;
		switch(_g) {
		case 0:
			throw "Missing variables in partial expression";
			break;
		case 1:
			f = function(x) {
				var v = qa.algebra.Constant.CReal(x);
				evalState.boundVars.set(vars[0],v);
				v;
				evalState.clearSteps();
				var res = qa.algebra.AlgebraEvaluator["eval"](_g1.expr,evalState);
				switch(res[1]) {
				case 0:
					switch(res[2][1]) {
					case 0:
						switch(res[2][2][1]) {
						case 2:
							var n = res[2][2][2];
							return n;
						default:
							return 0;
						}
						break;
					default:
						return 0;
					}
					break;
				default:
					return 0;
				}
			};
			frame.contentWindow.showFunction2D(primid,f);
			break;
		case 2:
			f = function(x1,y) {
				var v1 = qa.algebra.Constant.CReal(x1);
				evalState.boundVars.set(vars[0],v1);
				v1;
				var v2 = qa.algebra.Constant.CReal(y);
				evalState.boundVars.set(vars[1],v2);
				v2;
				evalState.clearSteps();
				var res1 = qa.algebra.AlgebraEvaluator["eval"](_g1.expr,evalState);
				switch(res1[1]) {
				case 0:
					switch(res1[2][1]) {
					case 0:
						switch(res1[2][2][1]) {
						case 2:
							var n1 = res1[2][2][2];
							return n1;
						default:
							return 0;
						}
						break;
					default:
						return 0;
					}
					break;
				default:
					return 0;
				}
			};
			frame.contentWindow.showFunction3D(primid,f);
			break;
		}
	}
	,__class__: qa.providers.MathBoxDisplay
});
qa.providers.Result = $hxClasses["qa.providers.Result"] = { __ename__ : ["qa","providers","Result"], __constructs__ : ["None","Error","Item"] };
qa.providers.Result.None = ["None",0];
qa.providers.Result.None.toString = $estr;
qa.providers.Result.None.__enum__ = qa.providers.Result;
qa.providers.Result.Error = function(msg) { var $x = ["Error",1,msg]; $x.__enum__ = qa.providers.Result; $x.toString = $estr; return $x; };
qa.providers.Result.Item = function(item,display) { var $x = ["Item",2,item,display]; $x.__enum__ = qa.providers.Result; $x.toString = $estr; return $x; };
qa.providers.SimpleDisplay = function(printed) {
	this.printed = printed;
};
$hxClasses["qa.providers.SimpleDisplay"] = qa.providers.SimpleDisplay;
qa.providers.SimpleDisplay.__name__ = ["qa","providers","SimpleDisplay"];
qa.providers.SimpleDisplay.__super__ = qa.providers.Display;
qa.providers.SimpleDisplay.prototype = $extend(qa.providers.Display.prototype,{
	printed: null
	,apply: function(element) {
		element.innerHTML = "<h3 class='provider-name'>" + Type.getClassName(Type.getClass(this.provider)) + "</h3><div class='content'>" + this.printed + "</div>";
	}
	,__class__: qa.providers.SimpleDisplay
});
qa.providers.StepDisplay = function(printed,steps) {
	qa.providers.SimpleDisplay.call(this,printed);
	this.steps = steps;
};
$hxClasses["qa.providers.StepDisplay"] = qa.providers.StepDisplay;
qa.providers.StepDisplay.__name__ = ["qa","providers","StepDisplay"];
qa.providers.StepDisplay.__super__ = qa.providers.SimpleDisplay;
qa.providers.StepDisplay.prototype = $extend(qa.providers.SimpleDisplay.prototype,{
	steps: null
	,apply: function(element) {
		new $(element).html("\r\n\t\t\t<h3 class='provider-name'>" + Type.getClassName(Type.getClass(this.provider)) + "</h3>\r\n\t\t\t<a href='#' class='show'>show steps</a>\r\n\t\t\t<a href='#' class='hide'>hide steps</a>\r\n\t\t\t<div class='content'>" + this.printed + "</div>\r\n\t\t\t<div class='steps'>" + ((function($this) {
			var $r;
			var _g1 = [];
			{
				var _g2 = 0;
				var _g3 = $this.steps;
				while(_g2 < _g3.length) {
					var step = _g3[_g2];
					++_g2;
					_g1.push("<div class='step'>" + step + "</div>");
				}
			}
			$r = _g1;
			return $r;
		}(this))).join("\n") + "</div>\r\n\t\t");
	}
	,__class__: qa.providers.StepDisplay
});
qa.providers.Query = function() { };
$hxClasses["qa.providers.Query"] = qa.providers.Query;
qa.providers.Query.__name__ = ["qa","providers","Query"];
qa.providers.Query.prototype = {
	question: null
	,provider: null
	,result: null
	,run: function() {
	}
	,cancel: function() {
	}
	,onResult: function(q) {
	}
	,__class__: qa.providers.Query
};
qa.providers.StaticQuery = function(result) {
	this.result = result;
};
$hxClasses["qa.providers.StaticQuery"] = qa.providers.StaticQuery;
qa.providers.StaticQuery.__name__ = ["qa","providers","StaticQuery"];
qa.providers.StaticQuery.__super__ = qa.providers.Query;
qa.providers.StaticQuery.prototype = $extend(qa.providers.Query.prototype,{
	run: function() {
		this.onResult(this);
	}
	,__class__: qa.providers.StaticQuery
});
qa.providers.OpenWeatherMapQuery = function(location) {
	this.location = location;
};
$hxClasses["qa.providers.OpenWeatherMapQuery"] = qa.providers.OpenWeatherMapQuery;
qa.providers.OpenWeatherMapQuery.__name__ = ["qa","providers","OpenWeatherMapQuery"];
qa.providers.OpenWeatherMapQuery.__super__ = qa.providers.Query;
qa.providers.OpenWeatherMapQuery.prototype = $extend(qa.providers.Query.prototype,{
	location: null
	,req: null
	,run: function() {
		this.req = new haxe.Http(qa.providers.OpenWeatherMapQuery.BASE_URL + encodeURIComponent(this.location));
		this.req.onData = $bind(this,this.onData);
		this.req.onError = $bind(this,this.onError);
		haxe.Timer.delay($bind(this,this.request),500);
	}
	,request: function() {
		if(this.req != null) this.req.request();
	}
	,cancel: function() {
		if(this.req != null) this.req.cancel();
		this.cleanup();
	}
	,onError: function(error) {
		this.cleanup();
		this.result = qa.providers.Result.None;
		this.onResult(this);
	}
	,onData: function(data) {
		this.cleanup();
		this.result = this.getResult(data);
		this.onResult(this);
	}
	,getResult: function(data) {
		var d = JSON.parse(data);
		if(!Object.prototype.hasOwnProperty.call(d,"cod") || d.cod != "200") return qa.providers.Result.None;
		var r = new qa.WeatherReport();
		r.time = d.dt;
		r.coordinates = { longitude : d.coord.lon, latitude : d.coord.lat};
		r.location = { country : d.sys.country, name : d.name};
		r.temperature = d.main.temp;
		r.humidity = d.main.humidity;
		r.pressure = d.main.pressure;
		r.wind = { speed : d.wind.speed, direction : d.wind.deg};
		r.cloudCover = d.clouds.all;
		if(Object.prototype.hasOwnProperty.call(d,"weather")) {
			var _g = 0;
			var _g1 = d.weather;
			while(_g < _g1.length) {
				var dw = _g1[_g];
				++_g;
				r.weather.push({ id : dw.id, name : dw.main, description : dw.description});
			}
		}
		return qa.providers.Result.Item(r,new qa.providers.SimpleDisplay(data));
	}
	,cleanup: function() {
		if(this.req == null) return;
		this.req.onData = null;
		this.req.onError = null;
		this.req = null;
	}
	,__class__: qa.providers.OpenWeatherMapQuery
});
qa.providers.OpenWeatherMapProvider = function() {
};
$hxClasses["qa.providers.OpenWeatherMapProvider"] = qa.providers.OpenWeatherMapProvider;
qa.providers.OpenWeatherMapProvider.__name__ = ["qa","providers","OpenWeatherMapProvider"];
qa.providers.OpenWeatherMapProvider.__interfaces__ = [qa.providers.Provider];
qa.providers.OpenWeatherMapProvider.prototype = {
	reset: function() {
	}
	,query: function(item) {
		if(Type.getClass(item) != String) return new qa.providers.StaticQuery(qa.providers.Result.None);
		var str = item;
		var prefix = "weather ";
		if(!StringTools.startsWith(str,prefix) || prefix.length + 2 > str.length) return new qa.providers.StaticQuery(qa.providers.Result.None);
		var location = HxOverrides.substr(str,prefix.length,null);
		return new qa.providers.OpenWeatherMapQuery(location);
	}
	,__class__: qa.providers.OpenWeatherMapProvider
};
qa.providers.WeatherPrinter = function() { };
$hxClasses["qa.providers.WeatherPrinter"] = qa.providers.WeatherPrinter;
qa.providers.WeatherPrinter.__name__ = ["qa","providers","WeatherPrinter"];
qa.providers.WeatherPrinter.printReport = function(r) {
	var printed = "";
	printed += qa.ValuePrinter.printInfoTag("geo-location","Location",qa.ValuePrinter.printLocation(r.location));
	printed += qa.ValuePrinter.printInfoTag("temperature","Temperature",qa.ValuePrinter.printTemperature(r.temperature));
	var _g = 0;
	var _g1 = r.weather;
	while(_g < _g1.length) {
		var w = _g1[_g];
		++_g;
		printed += qa.ValuePrinter.printInfoTag("weather","Weather",qa.ValuePrinter.printWeather(w));
	}
	printed += qa.ValuePrinter.printInfoTag("humidity-relative","Relative humidity",qa.ValuePrinter.printWithUnit(r.humidity,"%"));
	printed += qa.ValuePrinter.printInfoTag("pressure","Pressure",qa.ValuePrinter.printWithUnit(r.pressure," hPa"));
	printed += qa.ValuePrinter.printInfoTag("cloud-cover","Cloud cover",qa.ValuePrinter.printWithUnit(r.cloudCover,"%"));
	printed += qa.ValuePrinter.printInfoTag("wind","Wind",qa.ValuePrinter.printWind(r.wind));
	printed += qa.ValuePrinter.printInfoTag("time-measured","Measured",qa.ValuePrinter.printUnixTime(r.time));
	printed += qa.ValuePrinter.printInfoTag("geo-position","Position",qa.ValuePrinter.printPosition(r.coordinates));
	return printed;
};
qa.providers.WeatherReportDisplayProvider = function() {
};
$hxClasses["qa.providers.WeatherReportDisplayProvider"] = qa.providers.WeatherReportDisplayProvider;
qa.providers.WeatherReportDisplayProvider.__name__ = ["qa","providers","WeatherReportDisplayProvider"];
qa.providers.WeatherReportDisplayProvider.__interfaces__ = [qa.providers.Provider];
qa.providers.WeatherReportDisplayProvider.prototype = {
	reset: function() {
	}
	,query: function(item) {
		if(Type.getClass(item) != qa.WeatherReport) return new qa.providers.StaticQuery(qa.providers.Result.None);
		var report = item;
		return new qa.providers.StaticQuery(qa.providers.Result.Item(null,new qa.providers.SimpleDisplay(qa.providers.WeatherPrinter.printReport(report))));
	}
	,__class__: qa.providers.WeatherReportDisplayProvider
};
qa.providers.hscript = {};
qa.providers.hscript.HScriptParserProvider = function() {
	this.parser = new hscript.Parser();
};
$hxClasses["qa.providers.hscript.HScriptParserProvider"] = qa.providers.hscript.HScriptParserProvider;
qa.providers.hscript.HScriptParserProvider.__name__ = ["qa","providers","hscript","HScriptParserProvider"];
qa.providers.hscript.HScriptParserProvider.__interfaces__ = [qa.providers.Provider];
qa.providers.hscript.HScriptParserProvider.prototype = {
	parser: null
	,reset: function() {
	}
	,query: function(item) {
		if(Type.getClass(item) != String) return new qa.providers.StaticQuery(qa.providers.Result.None);
		var str = item;
		try {
			var ast = this.parser.parseString(str);
			var printed = new haxe.macro.Printer().printExpr(new hscript.Macro({ file : "<hscript>", min : 0, max : 0}).convert(ast));
			return new qa.providers.StaticQuery(qa.providers.Result.Item(ast,new qa.providers.SimpleDisplay(printed)));
		} catch( e ) {
			if( js.Boot.__instanceof(e,hscript.Error) ) {
				return new qa.providers.StaticQuery(qa.providers.Result.None);
			} else throw(e);
		}
	}
	,__class__: qa.providers.hscript.HScriptParserProvider
};
qa.providers.hscript.HScriptInterpProvider = function(synchronous) {
	this.synchronous = synchronous;
};
$hxClasses["qa.providers.hscript.HScriptInterpProvider"] = qa.providers.hscript.HScriptInterpProvider;
qa.providers.hscript.HScriptInterpProvider.__name__ = ["qa","providers","hscript","HScriptInterpProvider"];
qa.providers.hscript.HScriptInterpProvider.__interfaces__ = [qa.providers.Provider];
qa.providers.hscript.HScriptInterpProvider.prototype = {
	synchronous: null
	,reset: function() {
	}
	,query: function(item) {
		if(Type.getEnum(item) != hscript.Expr) return new qa.providers.StaticQuery(qa.providers.Result.None);
		var expr = item;
		if(this.synchronous) return new qa.providers.StaticQuery(qa.providers.hscript.HScriptInterpWorker.interpret(expr)); else return new qa.providers.hscript.HScriptInterpQuery(expr);
	}
	,__class__: qa.providers.hscript.HScriptInterpProvider
};
qa.providers.hscript.HScriptInterpQuery = function(ast) {
	this.ast = ast;
};
$hxClasses["qa.providers.hscript.HScriptInterpQuery"] = qa.providers.hscript.HScriptInterpQuery;
qa.providers.hscript.HScriptInterpQuery.__name__ = ["qa","providers","hscript","HScriptInterpQuery"];
qa.providers.hscript.HScriptInterpQuery.__super__ = qa.providers.Query;
qa.providers.hscript.HScriptInterpQuery.prototype = $extend(qa.providers.Query.prototype,{
	ast: null
	,worker: null
	,watchdog: null
	,run: function() {
		this.worker = new Worker("HScriptInterpWorker.js");
		this.worker.addEventListener("message",$bind(this,this.onMessage));
		this.worker.postMessage(haxe.Serializer.run(this.ast));
		this.watchdog = new haxe.Timer(1000);
		this.watchdog.run = $bind(this,this.onWatchdog);
	}
	,onMessage: function(e) {
		this.result = haxe.Unserializer.run(e.data);
		this.cleanup();
		this.onResult(this);
	}
	,onWatchdog: function() {
		this.cleanup();
		this.result = qa.providers.Result.Error("Execution time of " + 1000 + "ms exceeded.");
		this.onResult(this);
	}
	,cancel: function() {
		this.cleanup();
	}
	,cleanup: function() {
		if(this.watchdog != null) {
			this.watchdog.stop();
			this.watchdog = null;
		}
		if(this.worker != null) {
			this.worker.removeEventListener("message",$bind(this,this.onMessage));
			this.worker.terminate();
			this.worker = null;
		}
	}
	,__class__: qa.providers.hscript.HScriptInterpQuery
});
qa.providers.hscript.HScriptInterpWorker = function() {
	WorkerScript.call(this);
};
$hxClasses["qa.providers.hscript.HScriptInterpWorker"] = qa.providers.hscript.HScriptInterpWorker;
qa.providers.hscript.HScriptInterpWorker.__name__ = ["qa","providers","hscript","HScriptInterpWorker"];
qa.providers.hscript.HScriptInterpWorker.interpret = function(expr) {
	var interp = new hscript.Interp();
	var result;
	try {
		var interpResult = interp.execute(expr);
		result = qa.providers.Result.Item(interpResult,new qa.providers.SimpleDisplay("" + interpResult));
	} catch( e ) {
		if( js.Boot.__instanceof(e,hscript.Error) ) {
			result = qa.providers.Result.Error("HScript interpreter error: " + Std.string(e));
		} else throw(e);
	}
	return result;
};
qa.providers.hscript.HScriptInterpWorker.main = function() {
	WorkerScript["export"](new qa.providers.hscript.HScriptInterpWorker());
};
qa.providers.hscript.HScriptInterpWorker.__super__ = WorkerScript;
qa.providers.hscript.HScriptInterpWorker.prototype = $extend(WorkerScript.prototype,{
	onMessage: function(e) {
		var expr = haxe.Unserializer.run(e.data);
		var result = qa.providers.hscript.HScriptInterpWorker.interpret(expr);
		this.postMessage(haxe.Serializer.run(result));
	}
	,__class__: qa.providers.hscript.HScriptInterpWorker
});
var test = {};
test.TestAlgebra = function() {
	haxe.unit.TestCase.call(this);
};
$hxClasses["test.TestAlgebra"] = test.TestAlgebra;
test.TestAlgebra.__name__ = ["test","TestAlgebra"];
test.TestAlgebra.__super__ = haxe.unit.TestCase;
test.TestAlgebra.prototype = $extend(haxe.unit.TestCase.prototype,{
	testEval: function() {
		this.eq("0");
		this.eq("1");
		this.eq("-1");
		this.eq("0.1");
		this.eq("-0.1");
		this.eq("1+1");
		this.eq("1-1");
		this.eq("-1+1");
		this.eq("1/2");
		this.eq("-1/2");
		this.eq("1/2*3");
		this.eq("1+10");
		this.eq("0xFF");
		this.eq("1/2-1/2");
		this.eq("(3/4)/(5/6)");
		this.eq("0.5*1/2*3");
		this.eq("-1/2");
		this.eq("-1+1");
		this.eq("0xA+1+(-2/3)");
		this.eq("1+0.123");
		this.eq("1*1-1+1");
		this.eq("1+1");
		this.eq("(3/4)/(5/6)*0.1");
	}
	,ap: null
	,ae: null
	,hp: null
	,he: null
	,setup: function() {
		this.ap = new qa.providers.AlgebraParserProvider();
		this.ae = new qa.providers.AlgebraEvalProvider();
		this.hp = new qa.providers.hscript.HScriptParserProvider();
		this.he = new qa.providers.hscript.HScriptInterpProvider(true);
	}
	,tearDown: function() {
		this.ap = null;
		this.ae = null;
		this.hp = null;
		this.he = null;
	}
	,eq: function(equation) {
		var ar = this.evalAlgebra(equation);
		var arf;
		switch(ar[1]) {
		case 0:
			switch(ar[2][1]) {
			case 0:
				var c = ar[2][2];
				c = qa.algebra.Algebra.changeRank(c,qa.algebra.Constant.CReal(0));
				switch(c[1]) {
				case 2:
					var n = c[2];
					arf = n;
					break;
				default:
					throw "Unexpected constant type: " + Std.string(c);
				}
				break;
			default:
				throw "Unexpected algebra math expression: " + Std.string(ar);
			}
			break;
		default:
			throw "Unexpected algebra math expression: " + Std.string(ar);
		}
		var hr = this.evalHScript(equation);
		var hrf = hr;
		var result = Math.abs(arf - hrf) < test.TestAlgebra.EPSILON;
		if(!result) throw "Mismatch " + equation + " = " + arf + " != " + hrf + " | " + Std.string(ar) + " " + hr;
		this.assertTrue(result,{ fileName : "TestAlgebra.hx", lineNumber : 74, className : "test.TestAlgebra", methodName : "eq"});
	}
	,evalAlgebra: function(equation) {
		var result = this.ap.query(equation).result;
		switch(result[1]) {
		case 2:
			var parsed = result[2];
			switch(Type.enumIndex(parsed)) {
			case 0:
				switch(parsed[2][1]) {
				case 0:
					return parsed;
				default:
					var ev = this.ae.query(parsed).result;
					switch(ev[1]) {
					case 2:
						var evaluated = ev[2];
						return evaluated;
					default:
						throw "Unexpected algebra eval result: " + Std.string(result);
					}
				}
				break;
			default:
				var ev = this.ae.query(parsed).result;
				switch(ev[1]) {
				case 2:
					var evaluated = ev[2];
					return evaluated;
				default:
					throw "Unexpected algebra eval result: " + Std.string(result);
				}
			}
			break;
		default:
			throw "Unexpected algebra parsing result: " + Std.string(result);
		}
	}
	,evalHScript: function(equation) {
		var result = this.hp.query(equation).result;
		switch(result[1]) {
		case 2:
			var parsed = result[2];
			var ev = this.he.query(parsed).result;
			switch(ev[1]) {
			case 2:
				var evaluated = ev[2];
				return evaluated;
			default:
				throw "Unexpected hscript interp result: " + Std.string(result);
			}
			break;
		default:
			throw "Unexpected hscript parsing result: " + Std.string(result);
		}
	}
	,__class__: test.TestAlgebra
});
test.TestArithmetic = function() {
	haxe.unit.TestCase.call(this);
};
$hxClasses["test.TestArithmetic"] = test.TestArithmetic;
test.TestArithmetic.__name__ = ["test","TestArithmetic"];
test.TestArithmetic.__super__ = haxe.unit.TestCase;
test.TestArithmetic.prototype = $extend(haxe.unit.TestCase.prototype,{
	testAddZero: function() {
		this.assertEquals("0",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(0,0)),{ fileName : "TestArithmetic.hx", lineNumber : 8, className : "test.TestArithmetic", methodName : "testAddZero"});
		this.assertEquals("1",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(0,1)),{ fileName : "TestArithmetic.hx", lineNumber : 9, className : "test.TestArithmetic", methodName : "testAddZero"});
		this.assertEquals("2",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(0,2)),{ fileName : "TestArithmetic.hx", lineNumber : 10, className : "test.TestArithmetic", methodName : "testAddZero"});
		this.assertEquals("3",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(0,3)),{ fileName : "TestArithmetic.hx", lineNumber : 11, className : "test.TestArithmetic", methodName : "testAddZero"});
		this.assertEquals("4",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(0,4)),{ fileName : "TestArithmetic.hx", lineNumber : 12, className : "test.TestArithmetic", methodName : "testAddZero"});
		this.assertEquals("5",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(0,5)),{ fileName : "TestArithmetic.hx", lineNumber : 13, className : "test.TestArithmetic", methodName : "testAddZero"});
		this.assertEquals("6",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(0,6)),{ fileName : "TestArithmetic.hx", lineNumber : 14, className : "test.TestArithmetic", methodName : "testAddZero"});
		this.assertEquals("7",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(0,7)),{ fileName : "TestArithmetic.hx", lineNumber : 15, className : "test.TestArithmetic", methodName : "testAddZero"});
		this.assertEquals("8",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(0,8)),{ fileName : "TestArithmetic.hx", lineNumber : 16, className : "test.TestArithmetic", methodName : "testAddZero"});
		this.assertEquals("9",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(0,9)),{ fileName : "TestArithmetic.hx", lineNumber : 17, className : "test.TestArithmetic", methodName : "testAddZero"});
	}
	,testAddOne: function() {
		this.assertEquals("2",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(1,1)),{ fileName : "TestArithmetic.hx", lineNumber : 20, className : "test.TestArithmetic", methodName : "testAddOne"});
		this.assertEquals("3",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(1,2)),{ fileName : "TestArithmetic.hx", lineNumber : 21, className : "test.TestArithmetic", methodName : "testAddOne"});
		this.assertEquals("4",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(1,3)),{ fileName : "TestArithmetic.hx", lineNumber : 22, className : "test.TestArithmetic", methodName : "testAddOne"});
		this.assertEquals("5",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(1,4)),{ fileName : "TestArithmetic.hx", lineNumber : 23, className : "test.TestArithmetic", methodName : "testAddOne"});
		this.assertEquals("6",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(1,5)),{ fileName : "TestArithmetic.hx", lineNumber : 24, className : "test.TestArithmetic", methodName : "testAddOne"});
		this.assertEquals("7",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(1,6)),{ fileName : "TestArithmetic.hx", lineNumber : 25, className : "test.TestArithmetic", methodName : "testAddOne"});
		this.assertEquals("8",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(1,7)),{ fileName : "TestArithmetic.hx", lineNumber : 26, className : "test.TestArithmetic", methodName : "testAddOne"});
		this.assertEquals("9",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(1,8)),{ fileName : "TestArithmetic.hx", lineNumber : 27, className : "test.TestArithmetic", methodName : "testAddOne"});
	}
	,testAddCarry: function() {
		this.assertEquals("10",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(9,1)),{ fileName : "TestArithmetic.hx", lineNumber : 30, className : "test.TestArithmetic", methodName : "testAddCarry"});
		this.assertEquals("11",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(9,2)),{ fileName : "TestArithmetic.hx", lineNumber : 31, className : "test.TestArithmetic", methodName : "testAddCarry"});
		this.assertEquals("12",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(9,3)),{ fileName : "TestArithmetic.hx", lineNumber : 32, className : "test.TestArithmetic", methodName : "testAddCarry"});
		this.assertEquals("13",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(9,4)),{ fileName : "TestArithmetic.hx", lineNumber : 33, className : "test.TestArithmetic", methodName : "testAddCarry"});
		this.assertEquals("14",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(9,5)),{ fileName : "TestArithmetic.hx", lineNumber : 34, className : "test.TestArithmetic", methodName : "testAddCarry"});
		this.assertEquals("15",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(9,6)),{ fileName : "TestArithmetic.hx", lineNumber : 35, className : "test.TestArithmetic", methodName : "testAddCarry"});
		this.assertEquals("16",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(9,7)),{ fileName : "TestArithmetic.hx", lineNumber : 36, className : "test.TestArithmetic", methodName : "testAddCarry"});
		this.assertEquals("17",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(9,8)),{ fileName : "TestArithmetic.hx", lineNumber : 37, className : "test.TestArithmetic", methodName : "testAddCarry"});
		this.assertEquals("18",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(9,9)),{ fileName : "TestArithmetic.hx", lineNumber : 38, className : "test.TestArithmetic", methodName : "testAddCarry"});
	}
	,testAddOther: function() {
		this.assertEquals("10",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(0,10)),{ fileName : "TestArithmetic.hx", lineNumber : 41, className : "test.TestArithmetic", methodName : "testAddOther"});
		this.assertEquals("11",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(1,10)),{ fileName : "TestArithmetic.hx", lineNumber : 42, className : "test.TestArithmetic", methodName : "testAddOther"});
		this.assertEquals("20",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(10,10)),{ fileName : "TestArithmetic.hx", lineNumber : 43, className : "test.TestArithmetic", methodName : "testAddOther"});
		this.assertEquals("21",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(10,11)),{ fileName : "TestArithmetic.hx", lineNumber : 44, className : "test.TestArithmetic", methodName : "testAddOther"});
		this.assertEquals("30",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(11,19)),{ fileName : "TestArithmetic.hx", lineNumber : 45, className : "test.TestArithmetic", methodName : "testAddOther"});
		this.assertEquals("111",qa.arithmetic._Arithmetic.Integer_Impl_.toString(qa.arithmetic._Arithmetic.Integer_Impl_.add(qa.arithmetic._Arithmetic.Integer_Impl_.add(1,10),100)),{ fileName : "TestArithmetic.hx", lineNumber : 46, className : "test.TestArithmetic", methodName : "testAddOther"});
	}
	,__class__: test.TestArithmetic
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
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
$hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
if(Array.prototype.map == null) Array.prototype.map = function(f) {
	var a = [];
	var _g1 = 0;
	var _g = this.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = f(this[i]);
	}
	return a;
};
Theme.normal = 4539717;
Theme.disabled = 12566463;
Theme.error = 12298535;
byte._LittleEndianWriter.LittleEndianWriter_Impl_.LN2 = Math.log(2);
haxe.Serializer.USE_CACHE = false;
haxe.Serializer.USE_ENUM_INDEX = false;
haxe.Serializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.Unserializer.DEFAULT_RESOLVER = Type;
haxe.Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.ds.ObjectMap.count = 0;
hscript.Parser.p1 = 0;
hscript.Parser.readPos = 0;
hscript.Parser.tokenMin = 0;
hscript.Parser.tokenMax = 0;
hxparse.LexEngine.MAX_CODE = 255;
hxparse.LexEngine.EMPTY = [];
hxparse.LexEngine.ALL_CHARS = [{ min : 0, max : 255}];
qa.ValuePrinter.units = (function($this) {
	var $r;
	var _g = new haxe.ds.StringMap();
	_g.set("qa.Percent","%");
	_g.set("qa.RelativeHumidity","%");
	_g.set("qa.HectoPascal"," hPa");
	$r = _g;
	return $r;
}(this));
qa.ValuePrinter.valueTags = (function($this) {
	var $r;
	var _g = new haxe.ds.StringMap();
	_g.set("qa.MeasurementTime",{ id : "time-measured", name : "Measured", printer : "printUnixTime"});
	_g.set("qa.GeoPosition",{ id : "geo-position", name : "Position", printer : "printPosition"});
	_g.set("qa.GeoLocation",{ id : "geo-location", name : "Location", printer : "printLocation"});
	_g.set("qa.Temperature",{ id : "temperature", name : "Temperature", printer : "printTemperature"});
	_g.set("qa.RelativeHumidity",{ id : "humidity-relative", name : "Relative humidity"});
	_g.set("qa.AtmosphericPressure",{ id : "pressure", name : "Pressure"});
	_g.set("qa.CloudCover",{ id : "cloud-cover", name : "Cloud cover"});
	_g.set("qa.Wind",{ id : "wind", name : "Wind", printer : "printWind"});
	_g.set("qa.Weather",{ id : "weather", name : "Weather", printer : "printWeather"});
	$r = _g;
	return $r;
}(this));
qa.arithmetic._Arithmetic.Integer_Impl_.ZERO = 0;
qa.arithmetic._Arithmetic.Integer_Impl_.ONE = 1;
qa.arithmetic._Arithmetic.Real_Impl_.ZERO = 0;
qa.algebra.AlgebraLexer.tok = hxparse.Lexer.buildRuleset([{ rule : "0x[0-9a-fA-F]+", func : function(lexer) {
	return qa.algebra.AlgebraToken.TSymbol(qa.algebra.Symbol.SConst(qa.algebra.Constant.CInteger(qa.arithmetic._Arithmetic.Integer_Impl_.fromString(lexer.current),qa.arithmetic.NumberFormat.Hexadecimal)));
}},{ rule : "[0-9]+", func : function(lexer1) {
	return qa.algebra.AlgebraToken.TSymbol(qa.algebra.Symbol.SConst(qa.algebra.Constant.CInteger(qa.arithmetic._Arithmetic.Integer_Impl_.fromString(lexer1.current),qa.arithmetic.NumberFormat.Decimal)));
}},{ rule : "[0-9]+\\.[0-9]+", func : function(lexer2) {
	return qa.algebra.AlgebraToken.TSymbol(qa.algebra.Symbol.SConst(qa.algebra.Constant.CReal(qa.arithmetic._Arithmetic.Real_Impl_.fromString(lexer2.current))));
}},{ rule : "\\.[0-9]+", func : function(lexer3) {
	return qa.algebra.AlgebraToken.TSymbol(qa.algebra.Symbol.SConst(qa.algebra.Constant.CReal(qa.arithmetic._Arithmetic.Real_Impl_.fromString(lexer3.current))));
}},{ rule : "[0-9]+[eE][\\+\\-]?[0-9]+", func : function(lexer4) {
	return qa.algebra.AlgebraToken.TSymbol(qa.algebra.Symbol.SConst(qa.algebra.Constant.CReal(qa.arithmetic._Arithmetic.Real_Impl_.fromString(lexer4.current))));
}},{ rule : "[0-9]+\\.[0-9]*[eE][\\+\\-]?[0-9]+", func : function(lexer5) {
	return qa.algebra.AlgebraToken.TSymbol(qa.algebra.Symbol.SConst(qa.algebra.Constant.CReal(qa.arithmetic._Arithmetic.Real_Impl_.fromString(lexer5.current))));
}},{ rule : "[a-z][a-zA-Z0-9_]*", func : function(lexer6) {
	return qa.algebra.AlgebraToken.TSymbol(qa.algebra.Symbol.SVariable(lexer6.current));
}},{ rule : "\\(", func : function(lexer7) {
	return qa.algebra.AlgebraToken.TPOpen;
}},{ rule : "\\)", func : function(lexer8) {
	return qa.algebra.AlgebraToken.TPClose;
}},{ rule : "\\,", func : function(lexer9) {
	return qa.algebra.AlgebraToken.TComma;
}},{ rule : "\\+", func : function(lexer10) {
	return qa.algebra.AlgebraToken.TBinop(qa.algebra.AlgebraBinop.OpAdd);
}},{ rule : "\\-", func : function(lexer11) {
	return qa.algebra.AlgebraToken.TBinop(qa.algebra.AlgebraBinop.OpSub);
}},{ rule : "\\*", func : function(lexer12) {
	return qa.algebra.AlgebraToken.TBinop(qa.algebra.AlgebraBinop.OpMul);
}},{ rule : "\\/", func : function(lexer13) {
	return qa.algebra.AlgebraToken.TBinop(qa.algebra.AlgebraBinop.OpDiv);
}},{ rule : "\\^", func : function(lexer14) {
	return qa.algebra.AlgebraToken.TBinop(qa.algebra.AlgebraBinop.OpPow);
}},{ rule : "[\r\n\t ]", func : function(lexer15) {
	return lexer15.token(qa.algebra.AlgebraLexer.tok);
}},{ rule : "", func : function(lexer16) {
	return qa.algebra.AlgebraToken.TEof;
}}],"tok");
qa.algebra.AlgebraLexer.generatedRulesets = [qa.algebra.AlgebraLexer.tok];
qa.arithmetic._Arithmetic.SimpleFraction_Impl_.ZERO = { a : 0, b : 0};
qa.providers.OpenWeatherMapQuery.BASE_URL = "http://api.openweathermap.org/data/2.5/weather?q=";
qa.providers.hscript.HScriptInterpQuery.WATCHDOG_DELAY = 1000;
test.TestAlgebra.EPSILON = 1e-14;
Know.main();
})();

//# sourceMappingURL=know.js.map