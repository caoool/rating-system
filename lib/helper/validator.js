//if (Meteor.isClient) {
//    /**
//     * Custom validator for letters (uppercase/lowercase)
//     */
//    $.validator.addMethod("lettersOnly", function (value, element) {
//        return this.optional(element) || /^[a-zA-Z]+$/i.test(value);
//    }, "Please enter letters only.");
//
//    /**
//     * Custom validator for numbers only (0-9)
//     */
//    $.validator.addMethod("numbersOnly", function (value, element) {
//        return this.optional(element) || /^[0-9]+$/i.test(value);
//    }, "Please enter numbers only.");
//
//    /**
//     * Custom validator for dates (0-9 and slashes).  Does not check month, day or year.
//     */
//    $.validator.addMethod("date", function (value, element) {
//        return this.optional(element) || /^[0-9/]+$/i.test(value);
//    }, "Please enter dates only.");
//
//    /**
//     * Custom validator for phone numbers (0-9, (, ) and -).  Does not check number of digits, etc.
//     */
//    $.validator.addMethod("phone", function (value, element) {
//        return this.optional(element) || /^[0-9()-]+$/i.test(value);
//    }, "Please enter dates only.");
//
//    /**
//     * Custom validators for letters and numbers only.  Uppercase/lowercase letters and numbers (0-9).
//     */
//    $.validator.addMethod("lettersAndNumbersOnly", function (value, element) {
//        return this.optional(element) || /^[a-zA-Z0-9]+$/i.test(value);
//    }, "Please enter letters and numbers only.");
//}