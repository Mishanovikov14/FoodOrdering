import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import SignUpScreen from "../sign-up";
import { createServer } from '../../../utils/testServer';

createServer([
    {
      path: "/api/repositories",
      method: "get",
      res: (req, res, ctx) => {
        const language = req.url.searchParams.get("q").split("language:")[1];
  
        return {
          items: [
            { id: 1, full_name: `${language}_one` },
            { id: 2, full_name: `${language}_two` },
          ],
        };
      },
    },
  ]);

describe("Sign up screen", () => {
    const maybeThisWorks = jest.fn();

    it("should have 2 inputs fields", () => {
        render(<SignUpScreen/>);

        const inputs = screen.getAllByTestId("input");

        expect(inputs).toHaveLength(2);
    });
});