// jest.config.js
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Forneça o caminho para sua aplicação Next.js para carregar next.config.js e .env no ambiente de teste
  dir: './',
})

// Adicione quaisquer configurações personalizadas do Jest a serem passadas para o Jest
const customJestConfig = {
  // Adiciona mais opções de configuração antes de cada teste ser executado
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // Se estiver usando TypeScript com `paths` configurados no tsconfig.json, será necessário configurar o moduleNameMapper
  moduleNameMapper: {
     '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
   },
  testEnvironment: 'jest-environment-jsdom',
}

// createJestConfig é exportado desta forma para garantir que next/jest possa carregar a configuração do Next.js async
module.exports = createJestConfig(customJestConfig)