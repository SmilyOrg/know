package qa;
import byte.ByteData;
import hxmath.BigInt;
import qa.Arithmetic.ArithmeticError;
import qa.Arithmetic.Real;
import qa.Arithmetic.SimpleFraction;

enum ArithmeticBinop {
	OpAdd;
	OpSub;
	OpMul;
	OpDiv;
	OpPow;
}

enum NumberFormat {
	None;
	Decimal;
	Hexadecimal;
}

enum Constant {
	CInteger(n:Integer, format:NumberFormat);
	CRational(n:SimpleFraction);
	CReal(n:Real);
}

typedef RatioValue = {
	a:Integer,
	b:Integer,
}

class ArithmeticError {
	public var type:MathError;
	public function new(type) { this.type = type; }
}

enum MathError {
	DivisionByZero;
	UnsupportedOperation(msg:String);
}

abstract Real(Float) from Float to Float {
	
	public static inline var ZERO:Real = (0:Float);
	
	@:from static public function fromString(s:String):Real {
		var n:Float = Std.parseFloat(s);
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
		//var n:Null<Int> = 0;
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
		return Math.floor(Math.pow((a:Int), (b:Int)));
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



enum ArithmeticToken {
	TConst(c:Constant);
	TPOpen;
	TPClose;
	TBinop(op:ArithmeticBinop);
	TEof;
}

enum ArithmeticExpr {
	EConst(c:Constant);
	EBinop(op:ArithmeticBinop, e1:ArithmeticExpr, e2:ArithmeticExpr);
	EParenthesis(e:ArithmeticExpr);
	ENeg(e:ArithmeticExpr);
}

class ArithmeticPrinter {
	static public function printEvalStep(step:EvalStep) {
		return switch (step) {
			case Promote(c, p): 'Promoted ${printConstant(c)} to ${printConstant(p)}';
		}
	}
	static public function printConstant(c:Constant):String {
		var type = switch (c) {
			case CInteger(_, _): "integer";
			case CRational(_):   "rational";
			case CReal(_):       "real";
		};
		return '$type \\(' + printTexMath(EConst(c)) + '\\)';
		//return "\\(" + printTexMath(EConst(c)) + '^{$type} \\)';
	}
	
	static public function printTex(expr:ArithmeticExpr):String {
		return "$$"+printTexMath(expr)+"$$";
	}
	static public function printTexMath(expr:ArithmeticExpr):String {
		return switch (expr) {
			case EConst(c):
				switch (c) {
					case CInteger(n, format):
						switch (format) {
							case Decimal, None: ""+n;
							//case Hexadecimal: "\\mathtt{0x"+StringTools.hex(n, 0)+"}";
							case Hexadecimal: "\\mathtt{"+StringTools.hex(n, 0)+"}_{16}";
						}
					case CRational(n):
						//"\\frac{" + n.getNumerator() + "}{" + n.getDenominator() + "}";
						"\\frac{" + n.getNumerator().toString() + "}{" + n.getDenominator().toString() + "}";
					case CReal(n):
						"" + n.toString();
				};
			case EBinop(op, e1, e2):
				"";
				var p1 = printTexMath(e1);
				var p2 = printTexMath(e2);
				switch (op) {
					case OpAdd: '$p1 + $p2';
					case OpSub: '$p1 - $p2';
					case OpMul: '$p1 \\times $p2';
					case OpPow: '$p1^{$p2}';
					case OpDiv:
						p1 = printTexMath(escapeParens(e1));
						p2 = printTexMath(escapeParens(e2));
						'\\frac{$p1}{$p2}';
				}
			case EParenthesis(e):
				"\\left(" + printTexMath(e) + "\\right)";
			case ENeg(e):
				"-" + printTexMath(e);
		};
	}
	static public function escapeParens(expr:ArithmeticExpr) {
		return switch (expr) {
			case EParenthesis(e): escapeParens(e);
			case _: expr;
		}
	}
	/*
	static public function print(expr:ArithmeticExpr):String {
		return switch (expr) {
			case EConst(c):
				""+f;
			case EBinop(op, e1, e2):
				var ops = switch (op) {
					case OpAdd: "+";
					case OpSub: "-";
					case OpMul: "*";
					case OpDiv: "/";
					case OpPow: "^";
				}
				print(e1)+' $ops '+print(e2);
			case EParenthesis(e):
				"(" + print(e) + ")";
			case ENeg(e):
				"-" + print(e);
		}
	}
	*/
}

class ArithmeticLexer extends hxparse.Lexer implements hxparse.RuleBuilder {
	public function new() {
		super(null);
	}
	public function reset(input:ByteData, sourceName:String = "<input>") {
		current = "";
		this.input = input;
		source = sourceName;
		pos = 0;
	}
	static public var tok = @:rule [
	
		"0x[0-9a-fA-F]+" => TConst(CInteger(lexer.current, Hexadecimal)),
		"[0-9]+"         => TConst(CInteger(lexer.current, Decimal)),
		
		"[0-9]+\\.[0-9]+"                    => TConst(CReal(lexer.current)),
		"\\.[0-9]+"                          => TConst(CReal(lexer.current)),
		"[0-9]+[eE][\\+\\-]?[0-9]+"          => TConst(CReal(lexer.current)),
		"[0-9]+\\.[0-9]*[eE][\\+\\-]?[0-9]+" => TConst(CReal(lexer.current)),
		
		"\\(" => TPOpen,
		"\\)" => TPClose,
		"\\+" => TBinop(OpAdd),
		"\\-" => TBinop(OpSub),
		"\\*" => TBinop(OpMul),
		"\\/" => TBinop(OpDiv),
		"\\^" => TBinop(OpPow),
		"[\r\n\t ]" => lexer.token(tok),
		"" => TEof
	];
}

class ArithmeticParser extends hxparse.Parser<ArithmeticLexer, ArithmeticToken> implements hxparse.ParserBuilder {

	public var steps = new Array<String>();
	
	public function reset() {
		token = null;
		steps.splice(0, steps.length);
	}
	
	function step(msg:String) {
		steps.push(msg);
	}
	
	///*
	override function peek(n:Int) {
		var t = super.peek(n);
		step('peek($n): ' + t);
		return t;
	}
	//*/
	
	public function parse():ArithmeticExpr {
		//step("parse");
		var e = switch stream {
			case [TBinop(OpSub), e = parseElement()]:
				parseNext(ENeg(e));
			case _:
				parseNext(parseElement());
		}
		//step("postparse "+peek(0));
		return e;
	}
	
	public function parseElement():ArithmeticExpr {
		return switch stream {
			case [TConst(c)]:
				step('const $c');
				EConst(c);
			case [TPOpen, e = parse(), TPClose]:
				step('paren $e');
				EParenthesis(e);
		}
	}

	function parseNext(e1:ArithmeticExpr):ArithmeticExpr {
		//step("parseNext");
		return switch stream {
			case [TBinop(op), e2 = parse()]:
				step('binop $op $e1 $e2');
				binop(e1, op, e2);
			case _:
				step('pass $e1');
				e1;
		}
	}

	function binop(e1:ArithmeticExpr, op:ArithmeticBinop, e2:ArithmeticExpr) {
		return switch [e2, op] {
			case [EBinop(op2 = OpAdd | OpSub, e3, e4), op = OpMul | OpDiv],
			     [EBinop(op2 = OpMul, e3, e4), op = OpDiv],
			     [EBinop(op2, e3, e4), op = OpPow]:
				step('binopswitch e1=$e1 op=$op e2=$e2 op2=$op2 e3=$e3 e4=$e4');
				EBinop(op2, EBinop(op, e1, e3), e4);
			case _:
				step('binoppass $e1 $op $e2');
				EBinop(op, e1, e2);
		}
	}
}

enum EvalStep {
	Promote(c:Constant, p:Constant);
}

class ArithmeticEvaluator {
	
	static function getConstantRank(c:Constant) {
		return switch (c) {
			case CInteger(_, _):  0;
			case CRational(_): 1;
			case CReal(_):     2;
		}
	}
	
	static function changeRank(c:Constant, base:Constant, steps:List<EvalStep>) {
		var rb = getConstantRank(base);
		
		var rc = getConstantRank(c);
		while (rc != rb) {
			if (rc < rb) {
				var p = promoteConst(c);
				steps.add(Promote(c, p));
				c = p;
			} else {
				throw 'Constant demotion not supported';
			}
			
			var nrc = getConstantRank(c);
			if (nrc == rc) throw 'Constant rank change error $c($rc == $nrc) $base($rb)';
			rc = nrc;
		};
		
		return c;
	}
	
	static function promoteConst(c:Constant) {
		return switch (c) {
			case CInteger(n, _): CRational(n);
			case CRational(n): CReal(n);
			case _: throw 'Unimplemented rank promotion for $c';	
		}
	}
	
	static public function eval(e:ArithmeticExpr, steps:List<EvalStep>):Constant {
		return switch(e) {
			case EConst(c):
				c; 
			case EBinop(op, e1, e2):
				switch [e1, e2] {
					// Integer binops
					case [EConst(CInteger(a, opa)), EConst(CInteger(b, opb))]:
						var format = switch [opa, opb] {
							case [Hexadecimal, Hexadecimal]: Hexadecimal;
							case [Hexadecimal, Decimal],
								 [Decimal, Hexadecimal],
								 [Decimal, Decimal]: Decimal;
							case _: None;
						};
						switch(op) {
							case OpAdd: CInteger(a+b, format);
							case OpSub: CInteger(a-b, format);
							case OpMul: CInteger(a*b, format);
							case OpDiv: CRational(a/b);
							case OpPow: CInteger(a.pow(b), None);
						};
						
					// Ratio
					case [EConst(CRational(a)), EConst(CRational(b))]:
						switch(op) {
							case OpAdd: CRational(a+b);
							case OpSub: CRational(a-b);
							case OpMul: CRational(a*b);
							case OpDiv: CRational(a/b);
							case OpPow: CRational(a.pow(b));
							//case _: throw 'Unimplemented binop $op $a $b';
						};
						
					// Real
					case [EConst(CReal(a)), EConst(CReal(b))]:
						switch (op) {
							case OpAdd: CReal(a+b);
							case OpSub: CReal(a-b);
							case OpMul: CReal(a*b);
							case OpDiv: CReal(a/b);
							case OpPow: CReal(a.pow(b));
						};
					
					case [EConst(a), EConst(b)]:
						
						// None of the cases match, perhaps one of them needs promotion
						var ra = getConstantRank(a);
						var rb = getConstantRank(b);
						
						// No? Well then I'm out of ideas!
						if (ra == rb) throw 'Unimplemented binop $op $e1 $e2';
						
						// Promotion
						eval(if (rb > ra) {
							EBinop(op, EConst(changeRank(a, b, steps)), e2);
						} else {
							EBinop(op, e1, EConst(changeRank(b, a, steps)));
						}, steps);
					case _:
						eval(EBinop(op, EConst(eval(e1, steps)), EConst(eval(e2, steps))), steps);
						
				}
			case EParenthesis(e1):
				eval(e1, steps);
			case ENeg(e):
				switch (e) {
					case EConst(CInteger(n, format)):
						CInteger(n.negate(), format);
					case EConst(CRational(n)):
						CRational(n.negate());
					case _:
						if (e.match(EConst(_))) throw 'Unimplemented negation $e';
						eval(ENeg(EConst(eval(e, steps))), steps);
				}
		}
	}
}