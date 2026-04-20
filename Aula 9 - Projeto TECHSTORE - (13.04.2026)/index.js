const express = require('express');
const mysql = require('mysql2');

const app = express();

const porta = 3001

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const conectar = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: '909290',
    database: 'techstore'
});

// PÁGINA INICIAL
app.get('/', (req, res) => {
    res.render('index');
});



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// CLIENTES
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//rota página clientes
app.get('/clientes', (req, res) => {

    conectar.query('SELECT * FROM clientes', (err, results) => {

        if (err) {
            console.error(err);
            return res.send('Erro ao buscar clientes');
        }

        res.render('clientes', { registros: results });
    });

});

//rota para a pág do form de clientes
app.get('/clientes/form', (req, res) => {
    res.render('form', { tipo: 'cliente' });
});

//rota para os dados passarem form -> banco
app.post('/clientes/adicionar', (req, res) => {

    const { nome_clientes, email_clientes, telefone_clientes } = req.body;

    conectar.query(
        'INSERT INTO clientes (nome_clientes, email_clientes, telefone_clientes) VALUES (?, ?, ?)',
        [nome_clientes, email_clientes, telefone_clientes],
        (err) => {

            if (err) {
                console.error(err);
                return res.send('Erro ao cadastrar cliente');
            }

            res.redirect('/clientes');
        }
    );
});

//rota para a pág de edição
app.get('/clientes/editar/:id', (req, res) => {

    conectar.query(
        'SELECT * FROM clientes WHERE id_clientes = (?)',
        [req.params.id],
        (err, results) => {

            if (err) {
                console.error(err);
                return res.send('Erro ao buscar cliente');
            }

            res.render('editar', {
                tipo: 'cliente',
                registro: results[0]
            });
        }
    );
});

//rota para editar dados
app.post('/clientes/atualizar', (req, res) => {

    const { id_clientes, nome_clientes, email_clientes, telefone_clientes } = req.body;

    conectar.query(
        'UPDATE clientes SET nome_clientes=?, email_clientes=?, telefone_clientes=? WHERE id_clientes=?',
        [nome_clientes, email_clientes, telefone_clientes, id_clientes],
        (err) => {

            if (err) {
                console.error(err);
                return res.send('Erro ao atualizar');
            }

            res.redirect('/clientes');
        }
    );
});

//rota deletar cliente
app.get('/clientes/deletar/:id', (req, res) => {

    conectar.query(
        'DELETE FROM clientes WHERE id_clientes=?',
        [req.params.id],
        (err) => {

            if (err) {
                console.error(err);
                return res.send('Erro ao deletar');
            }

            res.redirect('/clientes');
        }
    );
});

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// PRODUTOS
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------






































//Inicia o servidor
app.listen(porta, () => {

    console.log(`Servidor iniciado em http://localhost:${porta}`);

});