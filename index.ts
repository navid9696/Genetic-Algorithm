import * as fs from 'fs'
import { osobnik } from './types/osobnik.js'
import { parametryAlgorytmu } from './types/parametryAlgorytmu.js'
import mutacja from './functions/mutacja.js'
import obliczPrzystosowanie from './functions/obliczPrzystosowanie.js'
import binarnyNaDziesietny from './functions/binarnyNaDziesietny.js'
import dziesietnyNaBinarny from './functions/dziesietnyNaBinarny.js'
import krzyzowanie from './functions/krzyzowanie.js'
import selekcjaKolaRuletki from './functions/selekcjaKolaRuletki.js'

const algorytmGenetyczny = ({ a, b, c, ile_wyn, lb_pop, ile_os, pr_krzyz, pr_mut }: parametryAlgorytmu): void => {
	fs.writeFileSync('wyniki.txt', '')

	for (let uruchomienie = 0; uruchomienie < ile_wyn; uruchomienie++) {
		let populacja: osobnik[] = Array.from({ length: ile_os }, () => ({
			chromosom: dziesietnyNaBinarny(Math.floor(Math.random() * 256)),
			przystosowanie: 0,
		}))

		let potomstwo: osobnik[] = []

		console.log(
			'________________________________________________________________ROZPOCZĘTO________________________________________________________________\n'
		)

		for (let pokolenie = 0; pokolenie < lb_pop; pokolenie++) {
			console.log(
				`Pokolenie ${pokolenie + 1}: ${populacja
					.map(osobnik => `${binarnyNaDziesietny(osobnik.chromosom)} (${osobnik.chromosom})`)
					.join(' | ')}\n`
			)

			const partnerzy = [...populacja]
			potomstwo = []

			while (partnerzy.length > 1) {
				const indeks1 = Math.floor(Math.random() * partnerzy.length)
				const rodzic1 = partnerzy.splice(indeks1, 1)[0]
				const indeks2 = Math.floor(Math.random() * partnerzy.length)
				const rodzic2 = partnerzy.splice(indeks2, 1)[0]
				const czyKrzyzowanie = Math.random() <= pr_krzyz
				const pc = Math.floor(Math.random() * 7) + 1
				const [dziecko1, dziecko2] = czyKrzyzowanie
					? krzyzowanie(rodzic1.chromosom, rodzic2.chromosom, pc)
					: [rodzic1.chromosom, rodzic2.chromosom]
				potomstwo.push({ chromosom: dziecko1, przystosowanie: 0 }, { chromosom: dziecko2, przystosowanie: 0 })

				console.log(
					`Krzyżowanie między Rodzic1 (${binarnyNaDziesietny(rodzic1.chromosom)} - ${
						rodzic1.chromosom
					}) i Rodzic2 (${binarnyNaDziesietny(rodzic2.chromosom)} - ${
						rodzic2.chromosom
					}) w punkcie ${pc} daje Dziecko1 (${binarnyNaDziesietny(
						dziecko1
					)} - ${dziecko1}) i Dziecko2 (${binarnyNaDziesietny(dziecko2)} - ${dziecko2})\n`
				)
			}

			potomstwo.forEach(osobnik => {
				osobnik.chromosom = mutacja(osobnik.chromosom, pr_mut)
			})

			console.log(
				`Potomstwo po mutacji: ${potomstwo
					.map(osobnik => `${binarnyNaDziesietny(osobnik.chromosom)} (${osobnik.chromosom})`)
					.join(' | ')}\n`
			)

			potomstwo.forEach(osobnik => {
				const x = binarnyNaDziesietny(osobnik.chromosom)
				const przystosowanie = obliczPrzystosowanie(x, a, b, c)
				osobnik.przystosowanie = przystosowanie
				console.log(`To jest wartość funkcji przed korektą: ${osobnik.przystosowanie}`)
			})

			const minimalnePrzystosowanie = Math.min(...potomstwo.map(osobnik => osobnik.przystosowanie))

			console.log('\n')
			console.log(`To jest minimalna wartość funkcji: ${minimalnePrzystosowanie}\n`)

			populacja = potomstwo.map(osobnik => ({
				...osobnik,
				przystosowanie:
					minimalnePrzystosowanie < 0 ? osobnik.przystosowanie - minimalnePrzystosowanie + 1 : osobnik.przystosowanie,
			}))

			populacja.forEach(osobnik => {
				console.log(`To jest wartość funkcji po korekcie: ${osobnik.przystosowanie}`)
			})

			console.log('\n')

			populacja = selekcjaKolaRuletki(populacja)

			console.log(
				`Wybrana populacja: ${potomstwo
					.map(osobnik => `[${osobnik.przystosowanie}] ${binarnyNaDziesietny(osobnik.chromosom)} ${osobnik.chromosom}`)
					.join(' | ')}\n`
			)

			pokolenie < lb_pop - 1 &&
				console.log(
					'________________________________________________________________KOLEJNA POPULACJA________________________________________________________________\n'
				)
		}

		const najlepszy = potomstwo.reduce((prev, current) =>
			prev.przystosowanie > current.przystosowanie ? prev : current
		)
		const najlepszyX = binarnyNaDziesietny(najlepszy.chromosom)
		const najlepszePrzystosowanie = najlepszy.przystosowanie
		fs.appendFileSync('wyniki.txt', `${najlepszePrzystosowanie} ${najlepszyX}\n`)
		console.log(`Najlepszy wynik : [${najlepszePrzystosowanie}] ${najlepszyX}`)
		console.log(
			'________________________________________________________________ZAKOŃCZONO________________________________________________________________\n'
		)
	}
}

algorytmGenetyczny({
	a: 4,
	b: 7,
	c: 2,
	ile_wyn: 50,
	lb_pop: 10,
	ile_os: 15,
	pr_krzyz: 0.8,
	pr_mut: 0.05,
})
//  w konsoli najpierw " npm i " aby pobrać wszystkie paczki
// następnie " node --loader=ts-node/esm index.ts " aby uruchomić
 
