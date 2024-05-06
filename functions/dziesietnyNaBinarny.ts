const dziesietnyNaBinarny = (dziesietny: number): string => {
	return dziesietny.toString(2).padStart(8, '0')
}

export default dziesietnyNaBinarny