/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config) => {
			config.resolve.fallback = {
					...config.resolve.fallback,
					fs: false, // Evita problemas ao lidar com o módulo `fs`
					path: false, // Evita problemas ao lidar com o módulo `path`
			};
			return config;
	},
};

export default nextConfig;
