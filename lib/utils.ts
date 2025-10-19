type ClassValue = string | number | boolean | undefined | null;
type ClassDictionary = Record<string, any>;
type ClassArray = ClassValue[];

// Fix: Changed function signature from `toVal(mix: ClassValue)` to `toVal(mix: any)`
// and added a null check. The original signature was too restrictive for a function
// intended to process arrays and objects, leading to incorrect type analysis.
function toVal(mix: any) {
	var k, y, str='';

	if (typeof mix === 'string' || typeof mix === 'number') {
		str += mix;
	} else if (typeof mix === 'object') {
		// Fix: Add a check for null to prevent errors on lines 12, 13, 14, and 21.
		// `typeof null` is 'object', so this check is necessary to avoid trying to iterate over null.
		if (mix) {
			if (Array.isArray(mix)) {
				for (k=0; k < mix.length; k++) {
					if (mix[k]) {
						if (y = toVal(mix[k])) {
							str && (str += ' ');
							str += y;
						}
					}
				}
			} else {
				for (k in mix) {
					if (mix[k]) {
						str && (str += ' ');
						str += k;
					}
				}
			}
		}
	}

	return str;
}

function clsx(...args: (ClassValue|ClassDictionary|ClassArray)[]) {
	var i=0, tmp, x, str='';
	while (i < args.length) {
		if (tmp = args[i++]) {
			if (x = toVal(tmp)) {
				str && (str += ' ');
				str += x
			}
		}
	}
	return str;
}

// A simplified tailwind-merge is too complex to implement here.
// For this app, clsx is sufficient to combine class names.
export function cn(...inputs: (ClassValue|ClassDictionary|ClassArray)[]) {
  return clsx(inputs);
}