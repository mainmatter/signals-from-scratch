let current_effect = null;

function state(iv) {
	let value = iv;
	const subscribers = new Set();
	return {
		get value() {
			if (current_effect) {
				subscribers.add(current_effect.fn);
				current_effect.set.add(subscribers);
			}
			return value;
		},
		set value(v) {
			value = v;
			for (let sub of [...subscribers]) {
				sub();
			}
		},
	};
}

function effect(fn) {
	const is_a_dependency_of = new Set();
	function actual_effect() {
		for (let set of is_a_dependency_of) {
			set.delete(actual_effect);
		}
		is_a_dependency_of.clear();
		current_effect = { fn: actual_effect, set: is_a_dependency_of };
		fn();
		current_effect = null;
	}
	actual_effect();
}

const count = state(0);
const checked = state(false);

effect(() => {
	console.log('running');
	if (checked.value) {
		console.log(`Count is: ${count.value}`);
	}
});

checked.value = true;
count.value = 1;
checked.value = false;
console.log('---');
count.value = 2;
count.value = 3;
