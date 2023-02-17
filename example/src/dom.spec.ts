import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import expect from '@nilscox/expect';
import sinon from 'sinon';
import { renderButton } from './dom';

describe('dom', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a button', () => {
    renderButton(sinon.spy());

    expect(screen.getByRole('button', { name: 'click me' })).toBeVisible();
  });

  it('clicks the button', async () => {
    const user = userEvent.setup();
    const onClick = sinon.spy();

    renderButton(onClick);
    user.click(screen.getByText('click me'));

    await waitFor(() => {
      expect(onClick).toHaveBeenCalled();
    });
  });

  it('failing test', async () => {
    renderButton(sinon.spy());
    expect(screen.getByRole('button', { name: 'click me' })).toBeDisabled();
  });
});
