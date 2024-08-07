import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { FaTimes, FaCheck, FaTrash, FaEdit } from 'react-icons/fa';
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from 'react-toastify';
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/usersApiSlice';

const UserListScreen = () => {
    const { data: users, refetch, isLoading, error } = useGetUsersQuery();
    const [ deleteUser, { isLoading: loadingDelete}] = useDeleteUserMutation();

    const deleteHandler = async(id) => {
        if(window.confirm('Delete user?')){
            const user = users.find((user) => user._id === id);
            if (user.isAdmin) {
                toast.error('Cannot delete admin users');
            } else {
                try {
                    await deleteUser(id);
                    toast.success('user deleted successfully');
                    refetch();
                } catch (err) {
                    toast.error(err?.data?.message || err.error);
                }
            }
        }
    };

  return (
    <>
      <h1>Users</h1>
      { loadingDelete && <Loader />}
      { isLoading ? (
        <Loader/>
      ) : (
        error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ADMIN</th>
                <th>CREATED ON</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                  <td>{user.isAdmin ? <FaCheck style={{ color: 'green'}}/> : <FaTimes style={{ color: 'red'}}/>}</td>
                  <td>{user.createdAt.substring(0,10)}</td>
                  <td>
                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                      <Button variant='success' className='btn-sm mx-2'>
                        <FaEdit style={{ color: 'white'}}/>
                      </Button>
                    </LinkContainer>
                    <Button
                        variant='danger'
                        className='btn-sm'
                        onClick={() => deleteHandler(user._id)}
                    >
                        <FaTrash style={{ color: 'white'}} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) 
      ) }
    </>
  )
};

export default UserListScreen;