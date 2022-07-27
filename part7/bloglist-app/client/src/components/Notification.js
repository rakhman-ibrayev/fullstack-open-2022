import Alert from '@mui/material/Alert'

const Notification = ({ notification }) => {
    if (notification === null) {
        return null
    }

    return (
        <Alert severity={notification.type}>
            {notification.text}
        </Alert>
    )
}

export default Notification