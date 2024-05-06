const krzyzowanie = (rodzic1: string, rodzic2: string, pc: number): [string, string] => {
	const dziecko1 = rodzic1.substring(0, pc) + rodzic2.substring(pc)
	const dziecko2 = rodzic2.substring(0, pc) + rodzic1.substring(pc)
	return [dziecko1, dziecko2]
}

export default krzyzowanie