// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mdx from '@astrojs/mdx';
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
	server: {
		port: 4322,
		host: true
	},
	vite: {
		server: {
			port: 4322,
			strictPort: false,
			hmr: {
				protocol: 'ws',
				host: 'localhost',
				port: 4322,
				clientPort: 4322
			}
		}
	},
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
			defaultLocale: 'pt',
			sidebar: [
				{
					label: 'Intro',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Manual de Instalação em Campo do Dispositivo IoT Smart Ruler Eletromidia', slug: 'intro/intro' },
					],
				},
				{
					label: 'Referência',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
		mdx(),
		vue(),
	],
});
