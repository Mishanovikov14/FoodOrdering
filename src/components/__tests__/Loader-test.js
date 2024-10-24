import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Loader from "../ui/Loader";

describe("Loader component", () => {
    it("render text on loader", () => {
        render(<Loader />);
    
    
        expect(screen.getByRole('button', { name: 'start' })).toBeDefined();
    });
});
