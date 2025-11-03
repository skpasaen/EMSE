let SEED = "666";
Nof1.SET_SEED(SEED);
const CHARSET = "abcdefghijklmnopqrstuvwxyz0123456789";
const STR_LEN = 12;

function makeRandomString(len = STR_LEN) {
    let s = "";
    for (let i = 0; i < len; i++) {
        const idx = Nof1.new_random_integer(CHARSET.length);
        s += CHARSET[idx];
    }
    return s;
}

function expectedKeyFor(style) {
    return style === "underline" ? "1" : "2";
}

let experiment_configuration_function = (writer) => { return {

    experiment_name: "TestExperiment",
    seed: SEED,

    variables: [
        { variable: "Style", treatments: ["underline", "blue"] }
    ],

    introduction_pages: writer.stage_string_pages_commands([
        writer.convert_string_to_html_string(
            "Please, open the browser in fullscreen mode (probably by pressing [F11]).\\ If Hello world is shown, press [1], otherwise [0]"),
    ]),

    pre_run_training_instructions: writer.string_page_command(
        writer.convert_string_to_html_string(
            "You entered the training phase."
        )),

    pre_run_experiment_instructions: writer.string_page_command(
        writer.convert_string_to_html_string(
            "You entered the experiment phase.\n\n"
        )),

    finish_pages: [
        writer.string_page_command(
            writer.convert_string_to_html_string(
                "Almost done. Next, the experiment data will be downloaded. Please, send the " +
                "downloaded file to the experimenter.\n\nAfter sending your email, you can close this window.\n\nMany thanks for participating."
            )
        )
    ],

    layout: [
        /* ToDo: Hier müssen die Variablen des Experiments rein. Zuerst der Name der Variablen,
                 die unterschiedlichen Werte stehen als List in den Treatments
                 Im ersten Experiment hat man normalerweise nur eine Variable mit 2 Treatments (Werte für die Variable)
         */
        { variable: "Style",  treatments: ["underline", "blue"]}
    ],

    /* ToDo: Hier gebe ich an, wie oft ich jede Treatmentkombination im Experiment testen möchte */
    repetitions: 5,

    /* ToDo: Hier gebe ich an, welche "Art" das Experiment ist. Ich gehe hier davon aus, dass es ein Experiment ist,dass
    *        darauf wartet, dass der Teilnehmer die Taste "0" oder "1" drückt
    *  */
    measurement: Nof1.Reaction_time(Nof1.keys(["1","2"])),

    task_configuration: (task) => {

        let nouns = new Nof1["Nouns"];
        let verbs = new Nof1["Verbs"];

        let random_noun = nouns.words[Nof1.new_random_integer(nouns.words.length)];
        let random_verb = verbs.words[Nof1.new_random_integer(verbs.words.length)];

        task.do_print_task = () => {


            //
            // // So erzeuge ich eine Zufallszahl (NICHT "default"-Code a la StackOverflow verwenden!
            // let random_int_from_0_to_excluding_10 = Nof1.new_random_integer(10);
            //
            // // Ausgabebildschirm wird gelöscht
            writer.clear_stage();

            // // Guck, weist den Wert der ersten Experiment-Variablen (task.treatment_combination.treatment_combination[0])
            // // der lokalen Variablen treatment_of_variable_MyVariable zu.
            // let treatment_of_variable_MyVariable = task.treatment_combination.treatment_combination[0].value;
            //
            // // Testet, ob Wert von MyVariable den Wert "dummy" hat
            // if( treatment_of_variable_MyVariable =="dummy") {
            //     writer.print_html_on_stage("Hello, world + random number: " + random_int_from_0_to_excluding_10);
            //     writer.print_html_on_stage("<h1>Mal reinen HTMLcode reingeschrieben</h1>");
            //     task.expected_answer = "1";
            // } else {
            //     writer.print_html_on_stage("Exit world + random number: " + random_int_from_0_to_excluding_10);
            //     task.expected_answer = "0";
            // }

            const style = task.treatment_combination.treatment_combination[0].value;
            const text = makeRandomString();
            const hlIndex = Nof1.new_random_integer(STR_LEN);


            const spans = [];
            for (let i = 0; i < text.length; i++) {
                const ch = text[i];
                if (i === hlIndex) {
                    const cls = style === "underline" ? "hl-underline" : "hl-blue";
                    spans.push(`<span class="${cls}">${ch}</span>`);
                } else {
                    spans.push(`<span>${ch}</span>`);
                }
            }

            writer.print_html_on_stage(`
  <div style="font-family:sans-serif;font-size:100%;">${spans.join("")}</div>
  <div style="margin-top:12px;font-size:90%;">
    Drücke [1] wenn <u>unterstrichen</u>, drücke [2] wenn <span style="color:blue;">blau</span>.
  </div>
`);

            task.expected_answer = expectedKeyFor(style);

        };

        /* ToDo: Legt fest, wann eine Aufgabe als bearbeitet angesehen wird. Die Variable "answer" ist dabei die Taste, die gedrückt wurde.
                 Falls es für das Experiment egal ist, einfach true zurückgeben.
        *  */
        task.accepts_answer_function = (answer) => (answer === "1" || answer === "2");

        /**
         * ToDo: Legt fest, was angezeigt wird, wenn die falsche Taste gedrückt wurde.
         */
        task.do_print_error_message = () => {
            writer.print_error_string_on_stage(
                writer.convert_string_to_html_string("Ok, there was something wrong. Dont mind. Just press the other button."));
        }

        /**
         * ToDo: Legt fest, was angezeigt wird, wenn die richtige Taste gedrückt wurde.
         */
        task.do_print_after_task_information = () => {
            writer.clear_stage();
            writer.print_html_on_stage(
                writer.convert_string_to_html_string("Ok, good answer. When you press [Enter] the experiment goes on."));
        }
    }
}};

Nof1.BROWSER_EXPERIMENT(experiment_configuration_function);
