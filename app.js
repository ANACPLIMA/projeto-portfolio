const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/auth', require('./routes/authRoutes'));
app.use('/alimentos', require('./routes/alimentoRoutes'));
app.use('/consumo', require('./routes/consumoRoutes'));
app.use('/progresso', require('./routes/progressoRoutes'));

// Swagger UI
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load(path.join(__dirname, 'resources', 'swagger.yaml'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rota raiz
app.get('/', (req, res) => {
  res.send('API de Estoque de Alimentos rodando. Documentação em /docs');
});

app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));