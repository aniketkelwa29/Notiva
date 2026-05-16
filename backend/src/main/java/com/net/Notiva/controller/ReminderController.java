package com.net.Notiva.controller;

import com.net.Notiva.dto.ReminderRequest;
import com.net.Notiva.entity.Reminder;
import com.net.Notiva.services.ReminderService;
import com.net.Notiva.services.ReminderServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {
    @Autowired
    private ReminderService reminderService;

    @PostMapping
    public Reminder createReminder(@RequestBody ReminderRequest dto) {
        return reminderService.createReminder(dto);
    }


    @GetMapping("/getActiveReminder")
    public List<Reminder> getAllReminders() {

        List<Reminder> reminder = reminderService.getAllReminders();
        List<Reminder> newReminder = new ArrayList<>();
        for (Reminder reminder1 : reminder) {
            if (
                    reminder1.getReminderTime() != null
                            &&
                            LocalDateTime.now().isBefore(
                                    reminder1.getReminderTime()
                            )
                            &&
                            !reminder1.isNotified()
            ) newReminder.add(reminder1);
        }

        return newReminder;
    }

    @GetMapping("/{id}")
    public Reminder getReminderbyId(@RequestBody String id) {
        return reminderService.getReminderById(id);
    }

    @PutMapping("/{id}")
    public Reminder updateReminder(@RequestBody String id, @RequestBody ReminderRequest dto) {

        Reminder reminder = reminderService.getReminderById(id);
        if (reminder.isNotified() == false) {
            reminder.setNotified(true);
        }
        return reminderService.updateReminder(id, dto);
    }


    @DeleteMapping("/{id}")
    public void deleteReminder(@RequestBody String id) {
        reminderService.deleteReminder(id);
    }
}
