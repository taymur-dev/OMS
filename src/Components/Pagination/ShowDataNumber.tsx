interface ShowDataNumberProps {
  start?: number;
  end?: number;
  total?: number;
}

export const ShowDataNumber: React.FC<ShowDataNumberProps> = ({
  start = 1,
  end = 10,
  total = 7,
}) => {
  return (
    // text-xs (extra small) mobile ke liye aur text-sm desktop ke liye
    <div className="text-xs sm:text-sm text-gray-800 ml-2">
      Showing {start} to {end} of {total} entries
    </div>
  );
};
