package qa.algebra;

import qa.algebra.Algebra;
import qa.arithmetic.Arithmetic;

using qa.algebra.Algebra;

enum EvalStepType {
	Expression(e:MathExpression);
	Result(c:MathExpression);
	Promote(c:Constant, p:Constant);
	Demote(c:Constant, d:Constant);
	UnknownSymbol(s:Symbol);
}

typedef EvalStep = {
	type:EvalStepType,
	level:Int
}

class EvalState {
	public var currentLevel:Int;
	public var steps = new Array<EvalStep>();
	public var boundVars = new Map<String, Constant>();
	public var evalPartial:Bool = false;
	public var functionMap = new Map<String, String->Array<MathExpression>->EvalState->MathExpression>();
	public function new() {
		boundVars["pi"]  = CMathematical(CReal(3.1415926535897932384626433832795028841971693993751058), "\u{1D70B}");
		boundVars["tau"] = CMathematical(CReal(6.2831853071795864769252867665590057683943387987502116), "\u{1D70F}");
		boundVars["e"]   = CMathematical(CReal(2.71828182845904523536028747135266249775724709369995), "e");
		boundVars["phi"] = CMathematical(CReal(1.61803398874989484820458683436563811), "\u03D5");
		
		addSingleReal("sin", Math.sin);
		addSingleReal("cos", Math.cos);
		addSingleReal("tan", Math.tan);
		addSingleReal("atan", Math.atan);
		addSingleReal("acos", Math.acos);
		addSingleReal("asin", Math.asin);
		addSingleReal("abs", Math.abs);
		addSingleReal("ceil", Math.ceil);
		addSingleReal("floor", Math.floor);
		addSingleReal("round", Math.round);
		addSingleReal("log", Math.log);
		
	}
	function addSingleReal(name:String, f:Float->Float) {
		functionMap[name] = function(name:String, args:Array<MathExpression>, state:EvalState) {
			if (args.length != 1) throw "Invalid function argument count";
			var arg = AlgebraEvaluator.eval(args[0], state);
			return switch (arg) {
				case ESymbol(SConst(c)):
					switch (Algebra.changeRank(c, CReal(Real.ZERO))) {
						case CReal(n): ESymbol(SConst(CReal(f((n:Float)))));
						case _: throw "Unable to change constant rank";
					}
				case _: EPartial(EFunction(name, [arg]));
			}
		};
	}
	public function addStep(type:EvalStepType) {
		steps.push({ type: type, level: currentLevel });
	}
	public function clearSteps() {
		steps.splice(0, steps.length);
	}
}

class AlgebraEvaluator {
	
	static public function accumulateVariables(e:MathExpression, vars:Array<String>) {
		switch (e) {
			case ESymbol(SVariable(name)):
				if (vars.indexOf(name) == -1) vars.push(name);
			case ESymbol(SConst(_)):
			case EFunction(_, args):
				for (arg in args) accumulateVariables(arg, vars);
			case EPartial(e), EParenthesis(e), ENeg(e):
				accumulateVariables(e, vars);
			case EBinop(_, e1, e2):
				accumulateVariables(e1, vars);
				accumulateVariables(e2, vars);
		}
	}
	
	static public function eval(e:MathExpression, state:EvalState):MathExpression {
		state.currentLevel++;
		switch (e) {
			case ESymbol(_), EParenthesis(_):
			case _: state.addStep(Expression(e));
		}
		//state.addStep(Expression(e));
		var result:MathExpression = switch(e) {
			case EFunction(name, args):
				var map = state.functionMap[name];
				if (map == null) {
					EPartial(e);
				} else {
					map(name, args, state);
				}
			case EPartial(partial):
				return state.evalPartial ? eval(partial, state) : e;
			case ESymbol(SConst(c)):
				e; 
			case ESymbol(v = SVariable(name)):
				var bound = state.boundVars[name];
				if (bound == null) {
					state.addStep(UnknownSymbol(v));
					e;
				} else {
					ESymbol(SConst(bound));
				}
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
								
							case [CMathematical(c, _), _]: eval(EBinop(op, ESymbol(SConst(c)), e2), state);
							case [_, CMathematical(c, _)]: eval(EBinop(op, e1, ESymbol(SConst(c))), state);
							
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
								EPartial(EBinop(op, ev1, ev2));
						}
						
				}
			case EParenthesis(e):
				eval(e, state);
			case ENeg(e):
				switch (e) {
					case ESymbol(SConst(c)):
						switch (c) {
							case CMathematical(m, _): c = m;
							case _:
						}
						ESymbol(SConst(switch (c) {
							case CInteger(n, format):  CInteger(n.negate(), format);
							case CRational(n): CRational(n.negate());
							case CReal(n): CReal(n.negate());
							case CMathematical(_, _): throw "Internal error trying to negate mathematical constant";
						}));
					case _:
						if (e.match(ESymbol(SConst(_)))) throw 'Unimplemented negation $e';
						//eval(ENeg(ESymbol(SConst(eval(e, state)))), state);
						//trace(e, state.boundVars);
						var ev = eval(e, state);
						switch (ev) {
							case ESymbol(SConst(c)):
								eval(ENeg(ev), state);
							case _:
								EPartial(ENeg(ev));
						}
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