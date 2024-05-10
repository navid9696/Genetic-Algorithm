import { osobnik } from '../types/osobnik'

const selekcjaKolaRuletki = (populacja: osobnik[]): osobnik[] => {
	const calkowitePrzystosowanie = populacja.reduce((acc, os) => acc + os.przystosowanie, 0)
	const prawdopodobienstwa = populacja.map(os => os.przystosowanie / calkowitePrzystosowanie)
	const skumulowanePrawdopodobienstwa = prawdopodobienstwa.reduce((acc, p, index) => {
		if (index === 0) {
			acc.push(p)
		} else {
			acc.push(acc[index - 1] + p)
		}
		return acc
	}, [] as number[])

	const nowaPopulacja: osobnik[] = []
	for (let i = 0; i < populacja.length; i++) {
		const losowanie = Math.random()
		const znalezionyIndex = skumulowanePrawdopodobienstwa.findIndex(p => p > losowanie)
		nowaPopulacja.push(populacja[znalezionyIndex >= 0 ? znalezionyIndex : populacja.length - 1])
	}

	return nowaPopulacja
}

export default selekcjaKolaRuletki
