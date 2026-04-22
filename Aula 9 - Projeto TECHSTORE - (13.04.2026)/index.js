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

//rota para editar dados form -> banco
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

//rota para a pág produtos
app.get('/produtos', (req, res) => {

    const query = ' SELECT produtos.*, categorias.nome_categorias FROM produtos INNER JOIN categorias ON produtos.id_categorias = categorias.id_categorias';

    conectar.query(query, (err, results) => {

        if (err) {
            console.error(err);
            return res.send('Erro ao buscar produtos');
        }

        res.render('produtos', { registros: results });
    });

});


//rota para pág do form de produtos
app.get('/produtos/form', (req, res) => {

    conectar.query('SELECT * FROM categorias', (err, categorias) => {

        res.render('form', {
            tipo: 'produto',
            categorias
        });

    });

});


// rota para os dados passarem form -> banco
app.post('/produtos/adicionar', (req, res) => {

    const { nome_produtos, preco_produtos, id_categorias } = req.body;

    conectar.query(
        'INSERT INTO produtos (nome_produtos, preco_produtos, id_categorias) VALUES (?, ?, ?)',
        [nome_produtos, preco_produtos, id_categorias],
        (err) => {

            if (err) {
                console.error(err);
                return res.send('Erro ao cadastrar produto');
            }

            res.redirect('/produtos');
        }
    );
});


//rota para a pág de edição
app.get('/produtos/editar/:id', (req, res) => {

    conectar.query(
        'SELECT * FROM produtos WHERE id_produtos = ?',
        [req.params.id],
        (err, results) => {

            if (err) {
                console.error(err);
                return res.send('Erro ao buscar produto');
            }

            conectar.query('SELECT * FROM categorias', (err, categorias) => {

                res.render('editar', {
                    tipo: 'produto',
                    registro: results[0],
                    categorias
                });
            });
        }
    );
});


//rota para editar dados form -> banco
app.post('/produtos/atualizar', (req, res) => {

    const { id_produtos, nome_produtos, preco_produtos, id_categorias } = req.body;

    conectar.query(
        'UPDATE produtos SET nome_produtos=?, preco_produtos=?, id_categorias=? WHERE id_produtos=?',
        [nome_produtos, preco_produtos, id_categorias, id_produtos],
        (err) => {

            if (err) {
                console.error(err);
                return res.send('Erro ao atualizar');
            }

            res.redirect('/produtos');
        }
    );
});

//rota deletar produto
app.get('/produtos/deletar/:id', (req, res) => {

    conectar.query(
        'DELETE FROM produtos WHERE id_produtos=?',
        [req.params.id],
        (err) => {

            if (err) {
                console.error(err);
                return res.send('Erro ao deletar');
            }

            res.redirect('/produtos');
        }
    );
});

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// CATEGORIAS
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//rota para pág da categoria
app.get('/categorias', (req, res) => {

    conectar.query('SELECT * FROM categorias', (err, results) => {

        if (err) {
            console.error(err);
            return res.send('Erro ao buscar categorias');
        }

        res.render('categorias', { registros: results });
    });

});


//rota para pág do form de categorias
app.get('/categorias/form', (req, res) => {
    res.render('form', { tipo: 'categoria' });
});


//rota rota para os dados passarem form -> banco
app.post('/categorias/adicionar', (req, res) => {

    const { nome_categorias } = req.body;

    conectar.query(
        'INSERT INTO categorias (nome_categorias) VALUES (?)',
        [nome_categorias],
        (err) => {

            if (err) {
                console.error(err);
                return res.send('Erro ao cadastrar');
            }

            res.redirect('/categorias');
        }
    );
});


//rota para a pág de edição
app.get('/categorias/editar/:id', (req, res) => {

    conectar.query(
        'SELECT * FROM categorias WHERE id_categorias = (?)',
        [req.params.id],
        (err, results) => {

            if (err) {
                console.error(err);
                return res.send('Erro ao buscar categoria');
            }

            res.render('editar', {
                tipo: 'categoria',
                registro: results[0]
            });
        }
    );
});


//rota para editar dados form -> banco
app.post('/categorias/atualizar', (req, res) => {

    const { id_categorias, nome_categorias } = req.body;

    conectar.query(
        'UPDATE categorias SET nome_categorias=? WHERE id_categorias=?',
        [ nome_categorias, id_categorias ],
        (err) => {

            if (err) {
                console.error(err);
                return res.send('Erro ao atualizar');
            }

            res.redirect('/categorias');
        }
    );
});

//rota deletar produto
app.get('/categorias/deletar/:id', (req, res) => {

    conectar.query(
        'DELETE FROM categorias WHERE id_categorias=?',
        [req.params.id],
        (err) => {

            if (err) {
                console.error(err);
                return res.send('Erro ao deletar');
            }

            res.redirect('/categorias');
        }
    );
});




//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------




//Inicia o servidor
app.listen(porta, () => {

    console.log(`Servidor iniciado em http://localhost:${porta}`);

});