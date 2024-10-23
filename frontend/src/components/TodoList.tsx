import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, Card, Button, Modal, Form, Input, Select, Badge, Space, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { fetchTodos, addTodo, updateTodoStatus, deleteTodo } from '../features/todos/todoSlice';
import type {AppDispatch, RootState} from '../store';
import type { Todo } from '../features/todos/todoSlice';

export const TodoList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const todos = useSelector((state: RootState) => state.todos.items);
    const status = useSelector((state: RootState) => state.todos.status);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

    useEffect(() => {
        const fetchStatus = filter === 'all' ? null : filter === 'completed';
         dispatch(fetchTodos(fetchStatus));
    }, [dispatch, filter]);

    const handleAddTodo = async (values: { title: string; description: string }) => {
        // @ts-ignore
         await dispatch(addTodo(values));
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleStatusChange = async (todo: Todo) => {
        // @ts-ignore
         dispatch(updateTodoStatus({
            id: todo.id,
            isCompleted: !todo.isCompleted
        }));
    };

    const handleDelete = async (id: string) => {
        await dispatch(deleteTodo(id));
    };

    const renderTodoItem = (todo: Todo) => (
        <List.Item
            key={todo.id}
            actions={[
                <Tooltip title={todo.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}>
                    <Button
                        icon={todo.isCompleted ? <CloseOutlined /> : <CheckOutlined />}
                        onClick={() => handleStatusChange(todo)}
                        type={todo.isCompleted ? 'default' : 'primary'}
                    />
                </Tooltip>,
                <Tooltip title="Delete">
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(todo.id)}
                    />
                </Tooltip>
            ]}
        >
            <Card
                title={
                    <Space>
                        <Badge status={todo.isCompleted ? 'success' : 'processing'} />
                        <span style={{ textDecoration: todo.isCompleted ? 'line-through' : 'none' }}>
              {todo.title}
            </span>
                    </Space>
                }
                style={{ width: '100%' }}
            >
                <p>{todo.description}</p>
                <small>Created: {new Date(todo.createdAt).toLocaleDateString()}</small>
            </Card>
        </List.Item>
    );

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <Space>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsModalVisible(true)}
                    >
                        Add Todo
                    </Button>
                    <Select
                        value={filter}
                        onChange={setFilter}
                        style={{ width: 120 }}
                    >
                        <Select.Option value="all">All</Select.Option>
                        <Select.Option value="active">Active</Select.Option>
                        <Select.Option value="completed">Completed</Select.Option>
                    </Select>
                </Space>
            </div>

            <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={todos}
                renderItem={renderTodoItem}
                loading={status === 'loading'}
            />

            <Modal
                title="Add New Todo"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddTodo}
                >
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please input the title!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};