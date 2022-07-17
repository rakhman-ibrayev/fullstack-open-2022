describe('Blog app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        cy.createUser({
            name: 'Rakhman Ibrayev',
            username: 'user',
            password: 'pass'
        })

        cy.createUser({
            name: 'User User',
            username: 'anotherUser',
            password: 'pass'
        })
    })

    it('Login form is shown', function () {
        cy.get('.login-form')
    })

    describe('Login', function () {
        it('succeeds with correct credentials', function () {
            cy.get('#username').type('user')
            cy.get('#password').type('pass')
            cy.get('.btn-login').click()
            cy.contains('Rakhman Ibrayev logged in')
        })

        it('fails with wrong credentials', function () {
            cy.get('#username').type('user')
            cy.get('#password').type('wrong')
            cy.get('.btn-login').click()

            cy.get('.error')
                .should('contain', 'wrong username or password')
                .and('have.css', 'color', 'rgb(255, 0, 0)')
        })
    })

    describe('When logged in', function () {
        beforeEach(function () {
            cy.login({ username: 'user', password: 'pass' })
        })

        it('A blog can be created', function () {
            cy.contains('new blog').click()
            cy.get('#title').type('cypress blog')
            cy.get('#author').type('Rakhman Ibrayev')
            cy.get('#url').type('url/url')
            cy.get('.btn-create').click()

            cy.contains('cypress blog Rakhman Ibrayev')
            cy.contains('a new blog cypress blog by Rakhman Ibrayev added')
        })

        it('A blog can be liked', function () {
            cy.createBlog({
                title: 'cypress blog',
                author: 'Rakhman Ibrayev',
                url: 'url/url'
            })

            cy.contains('view').click()
            cy.contains('like').click()
            cy.contains('likes 1')
        })

        it('A user can delete blogs he or she created', function () {
            cy.createBlog({
                title: 'cypress blog',
                author: 'Rakhman Ibrayev',
                url: 'url/url'
            })

            cy.contains('view').click()
            cy.contains('remove').click()
            cy.get('html').should('not.contain', 'cypress blog Rakhman Ibrayev')
        })

        it('A user cannot delete blogs he or she did not create', function () {
            cy.createBlog({
                title: 'cypress blog',
                author: 'Rakhman Ibrayev',
                url: 'url/url'
            })

            cy.contains('logout').click()
            cy.get('#username').type('anotherUser')
            cy.get('#password').type('pass')
            cy.get('.btn-login').click()

            cy.contains('view').click()
            cy.get('.togglable-content').should('not.contain', 'remove')
        })

        it('Blogs are given in descending order by number of likes', function () {
            cy.createBlog({
                title: 'first',
                author: '1',
                url: 'first/url'
            })

            cy.createBlog({
                title: 'second',
                author: '2',
                url: 'second/url'
            })

            cy.contains('second 2').contains('view').click()
            cy.contains('second/url')
            cy.contains('second 2').get('.btn-like').click()

            cy.visit('http://localhost:3000')

            cy.get('.blog').eq(0).should('contain', 'second 2')
            cy.get('.blog').eq(1).should('contain', 'first 1')
        })
    })
})