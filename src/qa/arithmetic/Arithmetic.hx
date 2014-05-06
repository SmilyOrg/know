package qa.arithmetic;

class ArithmeticError {
	public var type:ArithmeticErrorType;
	public function new(type) { this.type = type; }
}

enum ArithmeticErrorType {
	DivisionByZero;
	UnsupportedOperation(msg:String);
	Overflow;
}

enum NumberFormat {
	None;
	Decimal;
	Hexadecimal;
}

abstract Real(Float) from Float to Float {
	
	public static inline var ZERO:Real = (0:Float);
	
	@:from static public function fromString(s:String):Real {
		var n:Float = Std.parseFloat(s);
		//var n:Float = 0; throw "fix";
		if (Math.isNaN(n)) throw "Unable to convert from String to Float: "+s;
		return cast(n, Real);
	}
	
	@:to static public function toString(n:Real):String {
		return ""+(n:Float);
	}
	
	static inline public function negate(n:Real):Real {
		return -(n:Float);
	}
	
	static inline public function abs(n:Real):Real {
		return n < ZERO ? n.negate() : n;
	}
	
	static inline public function pow(a:Real, b:Real):Real {
		return Math.pow((a:Float), (b:Float));
	}
	
	@:op(A + B) static public function add(a:Real, b:Real):Real {
		return a+b;
	}
	@:op(A - B) static public function subtract(a:Real, b:Real):Real {
		return a-b;
	}
	@:op(A * B) static public function multiply(a:Real, b:Real):Real {
		return a*b;
	}
	@:op(A / B) static public function divide(a:Real, b:Real):Real {
		return a/b;
	}
	
	@:op(A > B) static public function greaterThan(a:Real, b:Real):Bool {
		return a > b;
	}
	@:op(A < B) static public function lessThan(a:Real, b:Real):Bool {
		return a < b;
	}
	
}



typedef RatioValue = {
	a:Integer,
	b:Integer,
}
abstract SimpleFraction(RatioValue) from RatioValue to RatioValue {
	
	public static var ZERO:SimpleFraction = ({ a: 0, b: 0 }:RatioValue);
	
	@:to static public function toReal(n:SimpleFraction):Real {
		var v:RatioValue = n;
		return (v.a:Real)/(v.b:Real);
	}
	
	public function getNumerator() {
		return this.a;
	}
	public function getDenominator() {
		return this.b;
	}
	
	public function gcd():Integer {
		var d:Integer = 0;
		var r:Integer = 0;
		var a = this.a.abs();
		var b = this.b.abs();
		while (true) {
			if (b == 0) {
				d = a;
				break;
			} else {
				r = a % b;
				a = b;
				b = r;
			}
		}
		return d;
	}
	
	public function post() {
		simplify();
	}
	
	public function simplify() {
		reduce();
		var v = this;
		if (v.a < 0 && v.b < 0) {
			v.a = v.a.negate();
			v.b = v.b.negate();
		}
	}
	
	public function reduce() {
		var d = gcd();
		var v = this;
		v.a = v.a.divideInteger(d);
		v.b = v.b.divideInteger(d);
	}
	
	
	static inline public function pow(a:SimpleFraction, b:SimpleFraction):SimpleFraction {
		var va:RatioValue = a;
		var vb:RatioValue = b;
		if (vb.b != 1) throw new ArithmeticError(UnsupportedOperation("Fractional powers not supported"));
		var r = ({
			a: va.a.pow(vb.a),
			b: va.b.pow(vb.a)
		}:SimpleFraction);
		r.post();
		return r;
	}
	
	static inline public function negate(n:SimpleFraction):SimpleFraction {
		return ZERO-n;
	}
	
	@:op(A + B) static public function add(a:SimpleFraction, b:SimpleFraction):SimpleFraction {
		var va:RatioValue = a;
		var vb:RatioValue = b;
		var r = ({
			a: va.a*vb.b + vb.a*va.b,
			b: va.b*vb.b
		}:SimpleFraction);
		r.post();
		return r;
	}
	
	@:op(A - B) static public function subtract(a:SimpleFraction, b:SimpleFraction):SimpleFraction {
		var va:RatioValue = a;
		var vb:RatioValue = b;
		var r = ({
			a: va.a*vb.b - vb.a*va.b,
			b: va.b*vb.b
		}:SimpleFraction);
		r.post();
		return r;
	}
	
	@:op(A * B) static public function multiply(a:SimpleFraction, b:SimpleFraction):SimpleFraction {
		var va:RatioValue = a;
		var vb:RatioValue = b;
		var r = ({
			a: va.a*vb.a,
			b: va.b*vb.b
		}:SimpleFraction);
		r.post();
		return r;
	}
	
	@:op(A / B) static public function divide(a:SimpleFraction, b:SimpleFraction):SimpleFraction {
		var va:RatioValue = a;
		var vb:RatioValue = b;
		if (vb.a == ZERO) throw new ArithmeticError(DivisionByZero);
		var r = ({
			a: va.a*vb.b,
			b: va.b*vb.a
		}:SimpleFraction);
		r.post();
		return r;
	}
}



abstract Integer(Int) from Int to Int {
	
	public static inline var ZERO:Integer = (0:Integer);
	public static inline var ONE:Integer = (1:Integer);
	
	@:from static public function fromString(s:String):Integer {
		var n:Null<Int> = Std.parseInt(s);
		//var n:Null<Int> = 0; throw "fix";
		if (n == null) throw "Unable to convert from String to Integer: "+s;
		var t:Int = n;
		return cast(t, Integer);
	}
	
	@:to static public function toString(n:Integer):String {
		return ""+(n:Int);
	}
	
	@:to static public function toSimpleFraction(n:Integer):SimpleFraction {
		return ({
			a: n,
			b: Integer.ONE
		}:SimpleFraction);
	}
	
	static inline public function negate(n:Integer):Integer {
		return -(n:Int);
	}
	
	static inline public function abs(n:Integer):Integer {
		return n < ZERO ? n.negate() : n;
	}
	
	static inline public function divideInteger(a:Integer, b:Integer):Integer {
		return Math.floor((a:Int)/(b:Int));
	}
	
	static inline public function pow(a:Integer, b:Integer):Integer {
		var f = Math.pow((a:Int), (b:Int));
		if (!Math.isFinite(f)) throw new ArithmeticError(Overflow);
		return Math.floor(f);
	}
	
	@:to static public function toReal(n:Integer):Real {
		return ((n:Int):Float);
	}
	
	@:op(A + B) static public function add(a:Integer, b:Integer):Integer {
		return a+b;
	}
	@:op(A - B) static public function subtract(a:Integer, b:Integer):Integer {
		return a-b;
	}
	@:op(A * B) static public function multiply(a:Integer, b:Integer):Integer {
		return a*b;
	}
	@:op(A / B) static public function divide(a:Integer, b:Integer):SimpleFraction {
		return ({ a: a, b: b }:SimpleFraction);
	}
	
	@:op(A > B) static public function greaterThan(a:Integer, b:Integer):Bool {
		return a > b;
	}
	@:op(A < B) static public function lessThan(a:Integer, b:Integer):Bool {
		return a < b;
	}
	
}