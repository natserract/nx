import { render } from '@testing-library/react';

import InputBase from './input-base';

describe('InputBase', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<InputBase />);
    expect(baseElement).toBeTruthy();
  });
});
