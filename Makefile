deploy:
	npx ts-node src/deploy.ts

generate-kdao:
	npx ts-node src/transfer-kdao-lambda $(destination)

generate-kusd:
	npx ts-node src/transfer-kusd-lambda $(destination)
