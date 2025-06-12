import "./comment.css"

const Comment = ({ content, userId, createdAt }) => {

    return (
        <div className="comment">
            <p><strong>Usuario ID:</strong> {userId}</p>
      <p>{content}</p>
      <small>{new Date(createdAt).toLocaleString()}</small>
        </div>
    )
}

export default Comment;