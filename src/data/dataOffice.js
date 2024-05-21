function dataOffice(number) {
  switch (number) {
    case 1:
      return 'Head Office';
    case 2:
      return 'Québec Office';

    case 3:
      return 'Brampton Office';

    case 4:
      return 'Moncton Office';
    default:
      console.log("Ce n'est pas un office valide valide.");
  }
}
export default dataOffice;
