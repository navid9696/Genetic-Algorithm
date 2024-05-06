 const mutacja = (chromosom: string, prMut: number): string => {
	return chromosom
		.split('')
		.map(gen => (Math.random() <= prMut ? (gen === '0' ? '1' : '0') : gen))
		.join('')
}
export default mutacja
