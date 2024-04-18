import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Container, Row, Col, Form, Alert } from 'react-bootstrap';
import DOMPurify from 'dompurify';

const Posts = (props) => {
    const [posts, setPosts] = useState([]);
    const [text, setText] = useState('');
    const [error, setError] = useState('');
    const ipcRenderer = window.ipcRenderer;
    const loggedIn = props.loggedIn;
    const email = loggedIn ? props.email : undefined;

    useEffect(() => {
        const response = JSON.parse(ipcRenderer.sendSync('getPosts', {}));
        console.log(response);
        if (!response.success) {
            setError(response.description);
        } else {
            setPosts(response.posts);
        }
    }, [ipcRenderer]);

    const handleWritePost = () => {
        let user;
        const postText = DOMPurify.sanitize(document.getElementById('postText').value);
        if ((postText.indexOf('\'') || postText.indexOf('"')) !== -1) {
            setError('No dangerous symbols pls')
            return
        }
        if (loggedIn) {
            if (postText.length <= 0) {
                return;
            }
            const token = localStorage.getItem('token');
            let response = JSON.parse(ipcRenderer.sendSync('checkAccount', {email: email}));
            if (!response.success) {
                setError(response.description);
            } else {
                user = response.user;
            }
            console.log('39:', localStorage);
            const post = {token: JSON.parse(localStorage.getItem('user')).token, text: postText, date: (new Date()).toString(), role: user.role, email: user.email};
            console.log('41: ', post);
            response = ipcRenderer.sendSync('postPost', post);
            console.log(response);
            response = JSON.parse(response);
            if (!response.success) {
                setError(response.description);
            } else {
                return;
            }
            setText('');
        }
    };

    const handleDeletePost = (postId) => {
        let user;
        let response = JSON.parse(ipcRenderer.sendSync('checkAccount', {email: email}));
        if (!response.success) {
            setError(response.description);
        } else {
            user = response.user;
        }
        if (loggedIn && user.role === 'admin') {
            // Здесь должна быть логика удаления поста
            console.log('Delete post with id:', postId);
            const args = {token: JSON.parse(localStorage.getItem('user')).token, postId: postId, email: user.email};
            console.log('args: ', args);
            const response = JSON.parse(ipcRenderer.send('deletePost', args));
            if (!response.success) {
                setError(response.description);
            } else {
                return;
            }
            setText('');
        }
    };

  return (
    <Container>
    {error && <Alert variant="danger">{error}</Alert>}
    <Row className="mb-3">
        <Col>
          <Form.Control
            id='postText'
            type="text"
            placeholder="Введите текст поста..."
            hidden={!loggedIn}
          />
        </Col>
        <Col xs="auto">
          <Button onClick={handleWritePost} hidden={!loggedIn}>
            Добавить пост
          </Button>
        </Col>
      </Row>
      {posts.map((post) => (
        <Row key={post.id} className="mb-3">
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>{post.userEmail} ({post.role})</Card.Title>
                <Card.Subtitle>{new Date(post.date).toLocaleString()}</Card.Subtitle>
                <Card.Text>{post.text}</Card.Text>
                <Button variant="danger" hidden={!loggedIn} onClick={() => handleDeletePost(post.id)}>
                  Удалить
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default Posts;
