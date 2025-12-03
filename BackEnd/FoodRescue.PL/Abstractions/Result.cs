

using static System.Runtime.InteropServices.JavaScript.JSType;

namespace FoodRescue.PL.Abstractions
{
    public class Result
    {
        public Result(bool isSuccess, Error error)
        {
            if ((isSuccess && error != Error.None) || (!isSuccess && error == Error.None))
            {
                throw new InvalidOperationException();
            }
            IsSuccess = isSuccess;
            Error = error;

        }
        public bool IsSuccess { get; }
        public bool IsFailure => !IsSuccess;
        public Error? Error { get; } = default!;

        public static Result Success() => new(true, Error.None);
        public static Result Failure(Error error) => new(false, error);
        public static Result<TValue> Success<TValue>(TValue value) => new(value, true, Error.None);
        public static Result<TValue> Failure<TValue>(Error error) => new(default!, false, error);

    }
    public class Result<TValue> : Result
    {
        private readonly TValue? value;

        public Result(TValue _value

            , bool isSuccess, Error error) : base(isSuccess, error)
        {
            if (isSuccess && _value == null)
            {
                throw new InvalidOperationException();
            }
            this.value = _value;

        }
        public TValue Value
        {
            get
            {
                if (IsFailure)
                {
                    throw new InvalidOperationException("Failure result can`nt have value.");
                }
                return value!;
            }
        }

    }
}
