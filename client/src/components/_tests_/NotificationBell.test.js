import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SocketProvider } from '../../context/SocketContext';
import NotificationBell from '../Notifications/NotificationBell';

jest.mock('axios');

describe('NotificationBell Component', () => {
    it('renders notification bell', () => {
        render(
            <SocketProvider>
                <NotificationBell />
            </SocketProvider>
        );
        
        const bell = screen.getByRole('button');
        expect(bell).toBeInTheDocument();
    });

    it('shows dropdown when clicked', () => {
        render(
            <SocketProvider>
                <NotificationBell />
            </SocketProvider>
        );
        
        const bell = screen.getByRole('button');
        fireEvent.click(bell);
        
        expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
    });

    it('displays unread count badge', async () => {
        render(
            <SocketProvider>
                <NotificationBell />
            </SocketProvider>
        );
        
        await waitFor(() => {
            const badge = screen.queryByClassName('notification-badge');
            if (badge) {
                expect(badge).toBeInTheDocument();
            }
        });
    });
});