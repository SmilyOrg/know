package qa.algebra;

import qa.algebra.Algebra.AlgebraBinop;
import qa.algebra.Algebra.MathExpression;
import qa.algebra.Evaluation;
import qa.arithmetic.Arithmetic;

using qa.algebra.Algebra;

enum MathExpression {
	ESymbol(c:Symbol);
	EBinop(op:AlgebraBinop, e1:MathExpression, e2:MathExpression);
	EParenthesis(e:MathExpression);
	ENeg(e:MathExpression);
	//EPartial(e:MathExpression);
}

class Algebra {
	
	public static function getPrecedenceRank(op:AlgebraBinop) {
		return switch (op) {
			case OpAdd:        0;
			case OpSub:        1;
			//case OpAdd, OpSub: 0;
			case OpMul, OpDiv: 2;
			case OpPow:        3;
		}
	}
	
	public static function getConstantRank(c:Constant) {
		return switch (c) {
			case CInteger(_, _):  0;
			case CRational(_): 1;
			case CReal(_):     2;
		}
	}
	
	public static function changeRank(c:Constant, base:Constant, state:EvalState):Constant {
		var rb = getConstantRank(base);
		
		var rc = getConstantRank(c);
		while (rc != rb) {
			if (rc < rb) {
				var p = promoteConst(c);
				state.addStep(Promote(c, p));
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
	
	public static function promoteConst(c:Constant) {
		return switch (c) {
			case CInteger(n, _): CRational(n);
			case CRational(n): CReal(n);
			case _: throw 'Unimplemented rank promotion for $c';	
		}
	}
}

enum Constant {
	CInteger(n:Integer, format:NumberFormat);
	CRational(n:SimpleFraction);
	CReal(n:Real);
}

enum Symbol {
	SConst(c:Constant);
	SVariable(name:String);
}

enum AlgebraBinop {
	OpAdd;
	OpSub;
	OpMul;
	OpDiv;
	OpPow;
}

class AlgebraPrinter {
	
	static private function getTag(s:String):String {
		var tagName = StringTools.replace(s, " ", "-");
		return '<span class="tag tag-$tagName">$s</span>';
	}
	
	static private function getExpressionTag(e:MathExpression) {
		return getTag(switch (e) {
			case ESymbol(SConst(_)):    "const";
			case ESymbol(SVariable(_)): "var";
			case EBinop(_):             "binop";
			case EParenthesis(_):       "paren";
			case ENeg(_):               "neg";
		});
	}
	
	static public function printEvalStep(step:EvalStep) {
		var type = switch (step.type) {
			case Promote(c, p): getTag("promoted") + '${printConstant(c)} to ${printConstant(p)}';
			case Expression(e):
				//"Eval " +
				var expr = switch (e) {
					//case EConst(c): 'constant ${printConstant(c)}';
					case ESymbol(SConst(c)): printConstant(c);
					case ESymbol(SVariable(name)): name;
					case EBinop(c, e1, e2): wrapTexInline(printTexMath(e, true));
					case EParenthesis(e): "";
					case ENeg(e): printTexInline(e);
				}
				getExpressionTag(e) + expr;
			case Result(e):
				getTag("result") + " \\(\\rightarrow\\) " + getExpressionTag(e) + wrapTexInline(printTexMath(e, true));
			case UnknownSymbol(s):
				getTag("unknown symbol") + printTexInline(ESymbol(s));
		};
		return '<div class="step" style="margin-left: ${step.level}em;">' + type + '</div>';
	}
	
	static public function printConstant(c:Constant):String {
		var type = switch (c) {
			case CInteger(_, _): "integer";
			case CRational(_):   "rational";
			case CReal(_):       "real";
		};
		return '$type \\(' + printTexMath(ESymbol(SConst(c))) + '\\)';
		//return "\\(" + printTexMath(EConst(c)) + '^{$type} \\)';
	}
	
	static public function printTex(expr:MathExpression):String {
		return "$$"+printTexMath(expr)+"$$";
	}
	static public function printTexInline(expr:MathExpression):String {
		return wrapTexInline(printTexMath(expr));
	}
	static public function wrapTexInline(tex:String):String {
		return "\\("+tex+"\\)";
	}
	static public function highlight(s:String):String {
		return '\\color{darkorange}{$s}';
	}
	static public function printTexMath(expr:MathExpression, highlightBinop:Bool = false):String {
		return switch (expr) {
			case ESymbol(SConst(c)):
				switch (c) {
					case CInteger(n, format):
						switch (format) {
							case Decimal, None: ""+n;
							//case Hexadecimal: "\\mathtt{0x"+StringTools.hex(n, 0)+"}";
							case Hexadecimal: "\\mathtt{"+StringTools.hex(n, 0)+"}_{16}";
						}
					case CRational(n):
						//"\\frac{" + n.getNumerator() + "}{" + n.getDenominator() + "}";
						"\\left(\\frac{" + n.getNumerator().toString() + "}{" + n.getDenominator().toString() + "}\\right)";
					case CReal(n):
						"" + n.toString();
				};
			case ESymbol(SVariable(name)):
				'\\mathtt{$name}';
			case EBinop(op, e1, e2):
				"";
				var p1 = printTexMath(wrapParens(e1, op));
				var p2 = printTexMath(wrapParens(e2, op));
				//var p1 = printTexMath(EParenthesis(e1));
				//var p2 = printTexMath(EParenthesis(e2));
				switch (op) {
					case OpAdd: '$p1 '+(highlightBinop ? highlight("+") : "+")+' $p2';
					case OpSub: '$p1 '+(highlightBinop ? highlight("-") : "-")+' $p2';
					case OpMul: '$p1 '+(highlightBinop ? highlight("\\times") : "\\times")+' $p2';
					case OpPow: '$p1^{$p2}';
					case OpDiv:
						//p1 = printTexMath(escapeParens(e1));
						//p2 = printTexMath(escapeParens(e2));
						p1 = printTexMath(e1);
						p2 = printTexMath(e2);
						'\\frac{$p1}{$p2}';
				}
			case EParenthesis(e):
				"\\left(" + printTexMath(e) + "\\right)";
			case ENeg(e):
				"-" + printTexMath(e);
		};
	}
	
	static private function wrapParens(e:MathExpression, pop:AlgebraBinop) {
		e = escapeParens(e);
		return switch (e) {
			case EBinop(op, e1, e2):
				pop.getPrecedenceRank() > op.getPrecedenceRank() ? EParenthesis(e) : e;
			case ESymbol(SConst(_)): e;
			case _: EParenthesis(e);
		}
	}
	static public function escapeParens(expr:MathExpression) {
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