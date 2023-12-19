import { renderHook, act } from '@testing-library/react';
import { useClickAndHold } from './use-click-and-hold'

jest.useFakeTimers();

describe('useClickAndHold', () => {
  it('should call the provided function when the button is held down', async () => {
    const mockFunction = jest.fn();

    const { result } = renderHook(() => useClickAndHold(mockFunction));

    // Simulate mouse down
    await act(() => {
      result.current.handleMouseDown();
    });

    // Fast-forward time to simulate a long hold (adjust TIMEOUT value accordingly)
    act(() => {
      jest.advanceTimersByTime(1501)
    });

    // Simulate mouse up
    await act(() => {
      result.current.handleMouseUp();
    });

    // Ensure the function is called
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  it('should not call the provided function if the button is released too quickly', () => {
    const mockFunction = jest.fn();

    const { result } = renderHook(() => useClickAndHold(mockFunction));

    // Simulate mouse down
    act(() => {
      result.current.handleMouseDown();
    });

    // Fast-forward time to simulate a quick release
    act(() => {
      jest.advanceTimersByTime(100); // Replace 100 with a time less than TIMEOUT
    });

    // Simulate mouse up
    act(() => {
      result.current.handleMouseUp();
    });

    // Ensure the function is not called
    expect(mockFunction).not.toHaveBeenCalled();
  });
});
