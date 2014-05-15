package test;
import haxe.unit.TestCase;
import qa.algebra.Algebra;
import qa.arithmetic.Arithmetic.Real;
import qa.providers.hscript.HScript;
import qa.providers.Provider.Result;

import qa.providers.Math;

using qa.algebra.Algebra;

class TestAlgebra extends TestCase {
	
	public function testEval() {
		eq("0");
		eq("1");
		eq("-1");
		eq("0.1");
		eq("-0.1");
		eq("1+1");
		eq("1-1");
		eq("-1+1");
		eq("1/2");
		eq("-1/2");
		eq("1/2*3");
		eq("1+10");
		eq("0xFF");
		eq("1/2-1/2");
		eq("(3/4)/(5/6)");
		eq("0.5*1/2*3");
		eq("-1/2");
		eq("-1+1");
		eq("0xA+1+(-2/3)");
		eq("1+0.123");
		eq("1*1-1+1");
		eq("1+1");
		eq("(3/4)/(5/6)*0.1");
	}
	
	static var EPSILON = 1e-14;
	
	var ap:AlgebraParserProvider;
	var ae:AlgebraEvalProvider;
	var hp:HScriptParserProvider;
	var he:HScriptInterpProvider;
	override public function setup():Void {
		ap = new AlgebraParserProvider();
		ae = new AlgebraEvalProvider();
		hp = new HScriptParserProvider();
		he = new HScriptInterpProvider(true);
	}
	override public function tearDown():Void {
		ap = null;
		ae = null;
		hp = null;
		he = null;
	}
	function eq(equation:String) {
		var ar:MathExpression = evalAlgebra(equation);
		var arf:Float = switch (ar) {
			case ESymbol(SConst(c)):
				c = c.changeRank(CReal(Real.ZERO));
				switch (c) {
					case CReal(n):
						(n:Float);
					case _: throw 'Unexpected constant type: $c';
				}
			case _: throw 'Unexpected algebra math expression: $ar';
		};
		var hr = evalHScript(equation);
		var hrf:Float = hr;
		var result:Bool = Math.abs(arf-hrf) < EPSILON;
		if (!result) throw 'Mismatch $equation = $arf != $hrf | $ar $hr';
		assertTrue(result);
	}
	function evalAlgebra(equation:String) {
		var result = ap.query(equation).result;
		switch (result) {
			case Item(parsed, _):
				switch (parsed) {
					case ESymbol(SConst(_)):
						return parsed;
					case _:
						var ev = ae.query(parsed).result;
						switch (ev) {
							case Item(evaluated, _):
								return evaluated;
							case _: throw 'Unexpected algebra eval result: $result';
						}
				}
			case _: throw 'Unexpected algebra parsing result: $result';
		}
	}
	function evalHScript(equation:String) {
		var result = hp.query(equation).result;
		switch (result) {
			case Item(parsed, _):
				var ev = he.query(parsed).result;
				switch (ev) {
					case Item(evaluated, _):
						return evaluated;
					case _: throw 'Unexpected hscript interp result: $result';
				}
			case _: throw 'Unexpected hscript parsing result: $result';
		}
	}
}