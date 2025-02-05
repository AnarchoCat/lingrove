import Mmimy from '@/mmimy'

export default function () {
	const mmimy = Mmimy.getInstance()
	mmimy.dictionary.save()
}
