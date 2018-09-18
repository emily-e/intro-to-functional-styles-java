import java.util.function.Function;


class Curry {
	public static void main(String [] args) {
		final Function<Integer, Function<Integer, Integer>> add = x -> y -> x + y;
		System.out.println(add.apply(1).apply(2));
	}
}
