package qa.algebra;

import haxe.macro.Expr;
import qa.algebra.Algebra;
import qa.arithmetic.Arithmetic;

using qa.algebra.Algebra;

enum EvalStepType {
	Expression(e:MathExpression);
	Result(c:MathExpression);
	Promote(c:Constant, p:Constant);
	UnknownSymbol(s:Symbol);
}

typedef EvalStep = {
	type:EvalStepType,
	level:Int
}

class EvalState {
	public var currentLevel:Int;
	public var steps = new List<EvalStep>();
	public function new() {}
	public function addStep(type:EvalStepType) {
		steps.add({ type: type, level: currentLevel });
	}
}

class AlgebraEvaluator {
	
	/*
	macro static public function evalConst(e:Expr) {
		return macro eval($e, state);
	}
	*/
	
	static public inline function evalConst(e:MathExpression, state:EvalState) {
		var result = eval(e, state);
		//switch (result) {
			//
		//}
	}
	
	static public function eval(e:MathExpression, state:EvalState):MathExpression {
		state.currentLevel++;
		switch (e) {
			case ESymbol(_), EParenthesis(_):
			case _: state.addStep(Expression(e));
		}
		//state.addStep(Expression(e));
		var result:MathExpression = switch(e) {
			case ESymbol(SConst(c)):
				e; 
			case ESymbol(v = SVariable(_)):
				state.addStep(UnknownSymbol(v));
				e;
			case EBinop(op, e1, e2):
				switch [e1, e2] {
					case [ESymbol(SConst(ca)), ESymbol(SConst(cb))]:
						switch [ca, cb] {
							// Integer binops
							case [CInteger(a, opa), CInteger(b, opb)]:
								var format = switch [opa, opb] {
									case [Hexadecimal, Hexadecimal]: Hexadecimal;
									case [Hexadecimal, Decimal],
										 [Decimal, Hexadecimal],
										 [Decimal, Decimal]: Decimal;
									case _: None;
								};
								ESymbol(SConst(switch(op) {
									case OpAdd: CInteger(a+b, format);
									case OpSub: CInteger(a-b, format);
									case OpMul: CInteger(a*b, format);
									case OpDiv: CRational(a/b);
									case OpPow: CInteger(a.pow(b), None);
								}));
								
							// Ratio
							case [CRational(a), CRational(b)]:
								ESymbol(SConst(switch(op) {
									case OpAdd: CRational(a+b);
									case OpSub: CRational(a-b);
									case OpMul: CRational(a*b);
									case OpDiv: CRational(a/b);
									case OpPow: CRational(a.pow(b));
									//case _: throw 'Unimplemented binop $op $a $b';
								}));
								
							// Real
							case [CReal(a), CReal(b)]:
								ESymbol(SConst(switch (op) {
									case OpAdd: CReal(a+b);
									case OpSub: CReal(a-b);
									case OpMul: CReal(a*b);
									case OpDiv: CReal(a/b);
									case OpPow: CReal(a.pow(b));
								}));
							
							case [a, b]:
								// None of the cases match, perhaps one of them needs promotion
								var ra = a.getConstantRank();
								var rb = b.getConstantRank();
								
								// No? Well then I'm out of ideas!
								if (ra == rb) throw 'Unimplemented binop $op $e1 $e2';
								
								// Promotion
								eval(if (rb > ra) {
									EBinop(op, ESymbol(SConst(a.changeRank(b, state))), e2);
								} else {
									EBinop(op, e1, ESymbol(SConst(b.changeRank(a, state))));
								}, state);
						};
						
					case _:
						//eval(EBinop(op, ESymbol(SConst(eval(e1, state))), ESymbol(SConst(eval(e2, state)))), state);
						//eval(EBinop(op, eval(e1, state), eval(e2, state)), state);
						var ev1 = eval(e1, state);
						var ev2 = eval(e2, state);
						switch [ev1, ev2] {
							case [ESymbol(SConst(a)), ESymbol(SConst(b))]:
								eval(EBinop(op, ev1, ev2), state);
							case _:
								EBinop(op, ev1, ev2);
						}
						
				}
			case EParenthesis(e):
				eval(e, state);
			case ENeg(e):
				switch (e) {
					case ESymbol(SConst(c)):
						ESymbol(SConst(switch (c) {
							case CInteger(n, format):  CInteger(n.negate(), format);
							case CRational(n): CRational(n.negate());
							case CReal(n): CReal(n.negate());
						}));
					case _:
						if (e.match(ESymbol(SConst(_)))) throw 'Unimplemented negation $e';
						//eval(ENeg(ESymbol(SConst(eval(e, state)))), state);
						eval(ENeg(eval(e, state)), state);
				}
		}
		state.currentLevel--;
		switch (e) {
			case ESymbol(_), EParenthesis(_):
			case _: state.addStep(Result(result));
		}
		return result;
	}
}