// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Smart Ruler Eletromidia',
			logo: {
				src: '/src/assets/eletromidia-logo-depto-projetos.svg',
			},
			customCss: ['./src/styles/custom.css'],
			components: {
				Footer: './src/components/Footer.astro',
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{
					label: 'Intro',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Manual de Instalação em Campo do Dispositivo IoT Smart Ruler Eletromidia', slug: 'intro/example' },
					],
				},
				{
					label: 'Referência',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
