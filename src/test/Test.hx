package test;
import haxe.unit.TestCase;

import qa.arithmetic.Arithmetic;

class Test extends TestCase {
	public function testAddZero() {
		assertEquals("0", (0:Integer)+(0:Integer));
		assertEquals("1", (0:Integer)+(1:Integer));
		assertEquals("2", (0:Integer)+(2:Integer));
		assertEquals("3", (0:Integer)+(3:Integer));
		assertEquals("4", (0:Integer)+(4:Integer));
		assertEquals("5", (0:Integer)+(5:Integer));
		assertEquals("6", (0:Integer)+(6:Integer));
		assertEquals("7", (0:Integer)+(7:Integer));
		assertEquals("8", (0:Integer)+(8:Integer));
		assertEquals("9", (0:Integer)+(9:Integer));
	}
	public function testAddOne() {
		assertEquals("2", (1:Integer)+(1:Integer));
		assertEquals("3", (1:Integer)+(2:Integer));
		assertEquals("4", (1:Integer)+(3:Integer));
		assertEquals("5", (1:Integer)+(4:Integer));
		assertEquals("6", (1:Integer)+(5:Integer));
		assertEquals("7", (1:Integer)+(6:Integer));
		assertEquals("8", (1:Integer)+(7:Integer));
		assertEquals("9", (1:Integer)+(8:Integer));
	}
	public function testAddCarry() {
		assertEquals("10", (9:Integer)+(1:Integer));
		assertEquals("11", (9:Integer)+(2:Integer));
		assertEquals("12", (9:Integer)+(3:Integer));
		assertEquals("13", (9:Integer)+(4:Integer));
		assertEquals("14", (9:Integer)+(5:Integer));
		assertEquals("15", (9:Integer)+(6:Integer));
		assertEquals("16", (9:Integer)+(7:Integer));
		assertEquals("17", (9:Integer)+(8:Integer));
		assertEquals("18", (9:Integer)+(9:Integer));
	}
	public function testAddOther() {
		assertEquals("10", (0:Integer)+(10:Integer));
		assertEquals("11", (1:Integer)+(10:Integer));
		assertEquals("20", (10:Integer)+(10:Integer));
		assertEquals("21", (10:Integer)+(11:Integer));
		assertEquals("30", (11:Integer)+(19:Integer));
		assertEquals("111", (1:Integer)+(10:Integer)+(100:Integer));
	}
}