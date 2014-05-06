package qa.algebra;

import byte.ByteData;
import qa.algebra.Algebra;
import qa.algebra.Evaluation;

using qa.algebra.Algebra;

enum AlgebraToken {
	TSymbol(c:Symbol);
	TPOpen;
	TPClose;
	TBinop(op:AlgebraBinop);
	TEof;
}

class AlgebraLexer extends hxparse.Lexer implements hxparse.RuleBuilder {
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
	
		"0x[0-9a-fA-F]+" => TSymbol(SConst(CInteger(lexer.current, Hexadecimal))),
		"[0-9]+"         => TSymbol(SConst(CInteger(lexer.current, Decimal))),
		
		"[0-9]+\\.[0-9]+"                    => TSymbol(SConst(CReal(lexer.current))),
		"\\.[0-9]+"                          => TSymbol(SConst(CReal(lexer.current))),
		"[0-9]+[eE][\\+\\-]?[0-9]+"          => TSymbol(SConst(CReal(lexer.current))),
		"[0-9]+\\.[0-9]*[eE][\\+\\-]?[0-9]+" => TSymbol(SConst(CReal(lexer.current))),
		
		"[a-z][a-zA-Z0-9_]*" => TSymbol(SVariable(lexer.current)),
		
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

class AlgebraParser extends hxparse.Parser<AlgebraLexer, AlgebraToken> implements hxparse.ParserBuilder {

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
	
	public function parse():MathExpression {
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
	
	public function parseElement():MathExpression {
		return switch stream {
			case [TSymbol(c)]:
				step('symbol $c');
				ESymbol(c);
			case [TPOpen, e = parse(), TPClose]:
				step('paren $e');
				EParenthesis(e);
		}
	}

	function parseNext(e1:MathExpression):MathExpression {
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

	function binop(e1:MathExpression, op:AlgebraBinop, e2:MathExpression):MathExpression {
		return switch [e1, e2] {
			// TODO fix power precedence
			case [_, EBinop(e2op, e21, e22)] if (op.getPrecedenceRank() > e2op.getPrecedenceRank()):
			//case [EBinop(e1op, e11, e12), EBinop(e2op, e21, e22)] if (op.getPrecedenceRank() > e2op.getPrecedenceRank()):
				//step('binopswitch e1=$e1 op=$op e2=$e2 op2=$op2 e3=$e3 e4=$e4');
				EBinop(e2op, EBinop(op, e1, e21), e22);
			case _:
				step('binoppass $e1 $op $e2');
				EBinop(op, e1, e2);
		}
	}
}