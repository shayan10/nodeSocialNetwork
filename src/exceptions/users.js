const CustomException = require('./exception');

module.exports = {
    UsernameDuplicateException: new CustomException(
        "This username already exists",
        "username_exists"
    ),
    UserCreationError: new CustomException(
        "Error creating user",
        "user_creation_error"
    )
}