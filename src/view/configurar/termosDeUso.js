import React from "react";

class UserTerms extends React.Component {
    render() {
        return (
            <div className="container d-flex flex-column justify-content-center align-items-center">
                <div className="card p-4 shadow-lg bg-white rounded">
                    <h1>Termo de Uso e Política de Privacidade</h1>
                    <p><strong>Última atualização:</strong> 18/05/2025</p>

                    <h2>1. Sobre o Praticorte</h2>
                    <p>O sistema <strong>Praticorte</strong> foi desenvolvido como parte de um <strong>Trabalho de Conclusão de Curso (TCC)</strong> com fins exclusivamente acadêmicos e educacionais. Apesar de estar disponível publicamente e permitir o cadastro de usuários, <strong>o sistema não foi projetado para uso comercial ou em produção</strong>, estando sujeito a falhas, instabilidades e falta de suporte técnico contínuo.</p>

                    <h2>2. Uso do Sistema</h2>
                    <p>O uso do sistema é <strong>livre e gratuito</strong>, e qualquer pessoa pode criar uma conta e explorar suas funcionalidades. No entanto, é importante destacar que:</p>
                    <ul>
                        <li><strong>Não recomendamos o uso de dados pessoais reais</strong> ao se cadastrar ou utilizar o sistema.</li>
                        <li>O <strong>Praticorte é de código aberto</strong> e seu conteúdo pode ser acessado, visualizado e modificado por terceiros.</li>
                        <li><strong>Você pode utilizar dados fictícios</strong> ou de teste para fins de experimentação, navegação e avaliação do sistema.</li>
                    </ul>

                    <h2>3. Privacidade e Responsabilidade</h2>
                    <p>O Praticorte <strong>não armazena nem processa dados com garantias de segurança ou confidencialidade</strong>. Ao utilizar o sistema, você concorda que:</p>
                    <ul>
                        <li><strong>Não nos responsabilizamos por qualquer uso indevido de informações inseridas</strong>, nem por vazamentos ou acessos não autorizados.</li>
                        <li><strong>A responsabilidade pelo conteúdo inserido é inteiramente do usuário</strong>.</li>
                        <li>O sistema <strong>não utiliza cookies, rastreadores ou coleta automatizada de dados pessoais</strong>.</li>
                    </ul>

                    <h2>4. Considerações Finais</h2>
                    <p>Ao utilizar o Praticorte, você declara estar ciente de que este é um projeto acadêmico, sem garantias de funcionamento, segurança ou privacidade, e que seu uso é feito <strong>por sua conta e risco</strong>.</p>
                    <p>Se desejar contribuir, relatar problemas ou entender melhor o projeto, o código-fonte está disponível publicamente e você pode acessá-lo e modificá-lo conforme os termos de licenciamento aplicáveis.</p>
                </div>
            </div>
        )
    }
}

export { UserTerms }